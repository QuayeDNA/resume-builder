import type { ExperienceEntry } from '../types'

const IS_DEV = (import.meta as Record<string, any>).env.DEV
const API_URL = IS_DEV
  ? 'https://api.anthropic.com/v1/messages'
  : '/api/claude'

const DEV_KEY: string = (import.meta as Record<string, any>).env.VITE_ANTHROPIC_API_KEY || ''

export async function callClaude(userPrompt: string, systemPrompt = '', maxTokens = 1000): Promise<string> {
  try {
    return await callAnthropic(userPrompt, systemPrompt, maxTokens)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn('Anthropic failed, falling back to free Groq:', msg)
    return callGroqDirect(userPrompt, systemPrompt, maxTokens)
  }
}

async function callAnthropic(userPrompt: string, systemPrompt: string, maxTokens: number): Promise<string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (IS_DEV && DEV_KEY) {
    headers['x-api-key'] = DEV_KEY
    headers['anthropic-version'] = '2023-06-01'
  }

  const body: Record<string, unknown> = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: userPrompt }],
  }
  if (systemPrompt) body.system = systemPrompt

  const res = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await res.json() as Record<string, unknown>

  if (data.error) throw new Error((data.error as { message?: string }).message || 'API error')

  if (data.provider === 'groq' && data.content) {
    return (data.content as { text?: string }[]).map((c) => c.text || '').join('').trim()
  }

  return (data.content as { text?: string }[] | undefined)?.map((c) => c.text || '').join('').trim() || ''
}

async function callGroqDirect(userPrompt: string, systemPrompt: string, maxTokens: number): Promise<string> {
  const messages: { role: string; content: string }[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  messages.push({ role: 'user', content: userPrompt })

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(err.error?.message || `Groq HTTP ${res.status}`)
  }

  const data = await res.json() as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content || ''
}

const RESUME_SYSTEM = 'You are an expert resume writer. Be concise, impactful, and ATS-optimized. Return only the requested content—no preamble, quotes, or markdown.'

export async function aiImproveSummary(currentSummary: string, jobTitle: string): Promise<string> {
  return callClaude(
    `Improve this professional summary for a ${jobTitle || 'professional'} to be more compelling and ATS-friendly. Return only the improved text:\n\n"${currentSummary}"`,
    RESUME_SYSTEM,
  )
}

export async function aiImproveBullet(bullet: string, role: string, company: string): Promise<string> {
  return callClaude(
    `Improve this resume bullet for a ${role || 'professional'} at ${company || 'a company'}. Start with a strong action verb and include a quantified metric where possible. Return only the improved bullet:\n\n"${bullet}"`,
    RESUME_SYSTEM,
  )
}

export async function aiSuggestBullets(role: string, company: string): Promise<string[]> {
  const raw = await callClaude(
    `Generate 3 strong, ATS-friendly resume bullet points for a ${role || 'professional'} at ${company || 'a company'}. Each should start with a different action verb and include a realistic metric. Return exactly 3 bullets, one per line, no numbering or dashes.`,
    RESUME_SYSTEM,
  )
  return raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 5).slice(0, 3)
}

export async function aiSuggestSkills(jobTitle: string, currentSkills: string[]): Promise<string[]> {
  const raw = await callClaude(
    `Suggest 6 additional ATS-friendly skills for a ${jobTitle || 'professional'}. Existing skills: ${currentSkills.join(', ')}. Return only comma-separated skill names, nothing else.`,
    RESUME_SYSTEM,
  )
  return raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6)
}

export async function aiGenerateCoverLetter({
  name, title, summary, skills, experience, role, company, tone,
}: {
  name: string
  title: string
  summary: string
  skills: string[]
  experience: ExperienceEntry[]
  role: string
  company: string
  tone: string
}): Promise<string> {
  return callClaude(
    `Write a ${tone || 'professional'} cover letter body for ${name || 'the applicant'} applying for ${role || 'the role'} at ${company || 'the company'}.

Applicant background: ${title}. ${summary}
Top skills: ${skills.slice(0, 6).join(', ')}
Recent experience: ${experience[0]?.role || ''} at ${experience[0]?.company || ''}: ${experience[0]?.bullets?.[0] || ''}

Write exactly 3 compelling paragraphs. Do NOT include salutation or sign-off. Return only the body paragraphs.`,
    'You are a professional cover letter writer. Be persuasive, specific, and avoid generic phrases.',
    1200,
  )
}
