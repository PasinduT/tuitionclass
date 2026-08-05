import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/http.ts'
import { geminiModel, parseJson } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { importJobId, storagePath, kind = 'question_paper', subject, year, paperType } = await req.json()
    if (!importJobId || !storagePath) return json({ error: 'importJobId and storagePath are required' }, 400)

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    await supabase.from('import_jobs').update({ status: 'processing', progress: 10 }).eq('id', importJobId)
    const { data: file, error: downloadError } = await supabase.storage.from('papers').download(storagePath)
    if (downloadError) throw downloadError
    const bytes = new Uint8Array(await file.arrayBuffer())
    const base64 = btoa(bytes.reduce((s, b) => s + String.fromCharCode(b), ''))

    const prompt = kind === 'marking_scheme'
      ? `Extract every marking-scheme entry from this Sri Lankan O/L ${subject} paper (${year}, ${paperType}). Return JSON: {"entries":[{"question_number":"","model_answer":"","marks":1,"mark_allocation":[],"grading_guidance":"","confidence":0}]}.
Preserve numbering, mathematical notation, units and alternative accepted answers. Never invent unreadable content; flag it in grading_guidance.`
      : `Extract every question from this Sri Lankan English-medium O/L ${subject} paper (${year}, ${paperType}). Return JSON: {"questions":[{"question_number":"","body":"","format":"multiple_choice|structured|short_answer|essay|calculation|diagram|mixed","options":null,"marks":1,"topic":"","subtopic":"","difficulty":"easy|medium|hard","tags":[],"confidence":0,"page":1,"asset_notes":[]}]}.
Preserve multi-part numbering, equations, tables and diagram references. Never infer missing text; identify unreadable content in asset_notes.`

    const model = geminiModel('You are a precise Sri Lankan O/L examination document analyst. Output only valid JSON matching the requested shape.')
    const result = await model.generateContent([{ text: prompt }, { inlineData: { data: base64, mimeType: 'application/pdf' } }])
    const extracted = parseJson(result.response.text())
    await supabase.from('import_jobs').update({ status: 'review_ready', progress: 100, provider_model: Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash', result_summary: { count: extracted.questions?.length || extracted.entries?.length || 0 } }).eq('id', importJobId)
    return json({ importJobId, ...extracted })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Extraction failed' }, 500)
  }
})
