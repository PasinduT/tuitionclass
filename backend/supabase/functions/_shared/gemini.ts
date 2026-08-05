import { GoogleGenerativeAI, SchemaType } from 'npm:@google/generative-ai@0.21.0'

export function geminiModel(systemInstruction: string) {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')
  const client = new GoogleGenerativeAI(apiKey)
  return client.getGenerativeModel({
    model: Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash',
    systemInstruction,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
  })
}

export function parseJson(text: string) {
  return JSON.parse(text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim())
}
