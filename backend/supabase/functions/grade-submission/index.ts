import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/http.ts'
import { geminiModel, parseJson } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { submissionId } = await req.json()
    if (!submissionId) return json({ error: 'submissionId is required' }, 400)
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: submission, error } = await supabase.from('submissions').select('*, questions(*)').eq('id', submissionId).single()
    if (error || !submission) throw error || new Error('Submission not found')
    const q = submission.questions
    const prompt = `Grade this response fairly using the supplied marking guidance.
Question: ${q.body}
Format: ${q.format}; Subject/topic: ${q.topic_id || q.subject_id}; Maximum marks: ${q.marks}
Expected answer: ${JSON.stringify(q.correct_answer || q.model_answer)}
Marking guidance: ${q.grading_guidance || 'Use standard O/L marking principles.'}
Student answer: ${JSON.stringify(submission.answer)}
Return JSON: {"marks_earned":0,"is_correct":false,"feedback":"","mistake_explanation":"","suggested_answer":"","topic_weakness_signal":0,"recommended_content":[]}.
marks_earned must be between 0 and ${q.marks}. Feedback must be specific, encouraging, concise, and appropriate for ages 14–18.`
    const modelName = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash'
    const result = await geminiModel('You are a consistent Sri Lankan O/L examiner. Follow the marking scheme and output only valid JSON.').generateContent(prompt)
    const grade = parseJson(result.response.text())
    const safeMarks = Math.max(0, Math.min(Number(q.marks), Number(grade.marks_earned) || 0))
    const { data: saved, error: saveError } = await supabase.from('grading_results').upsert({ submission_id: submissionId, marks_earned: safeMarks, total_marks: q.marks, is_correct: grade.is_correct, feedback: grade.feedback, mistake_explanation: grade.mistake_explanation, suggested_answer: grade.suggested_answer, topic_weakness_signal: grade.topic_weakness_signal, recommended_content: grade.recommended_content || [], model: modelName, raw_response: grade, leaderboard_points: safeMarks === Number(q.marks) ? Math.ceil(Number(q.marks) * 15) : 5 }, { onConflict: 'submission_id' }).select().single()
    if (saveError) throw saveError
    await supabase.from('submissions').update({ status: 'auto_graded' }).eq('id', submissionId)
    return json(saved)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Grading failed' }, 500)
  }
})
