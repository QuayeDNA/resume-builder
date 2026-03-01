/**
 * Frontend Claude API client
 * In development, calls the Anthropic API directly (requires VITE_ANTHROPIC_API_KEY).
 * In production (Vercel), calls /api/claude proxy to keep the key secret.
 */

const IS_DEV = import.meta.env.DEV
const API_URL = IS_DEV
  ? 'https://api.anthropic.com/v1/messages'
  : '/api/claude'

const DEV_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

/**
 * Call Claude with a prompt and optional system prompt
 * @param {string} userPrompt
 * @param {string} [systemPrompt]
 * @param {number} [maxTokens]
 * @returns {Promise<string>}
 */
export async function callClaude(userPrompt, systemPrompt = '', maxTokens = 1000) {
  const headers = { 'Content-Type': 'application/json' }
  if (IS_DEV && DEV_KEY) {
    headers['x-api-key']         = DEV_KEY
    headers['anthropic-version'] = '2023-06-01'
  }

  const body = {
    model:      'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages:   [{ role: 'user', content: userPrompt }],
  }
  if (systemPrompt) body.system = systemPrompt

  const res  = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await res.json()

  if (data.error) throw new Error(data.error.message || 'API error')
  return data.content?.map((c) => c.text || '').join('').trim()
}

// ── Prompt helpers ─────────────────────────────────────────────────────────

const RESUME_SYSTEM = 'You are an expert resume writer. Be concise, impactful, and ATS-optimized. Return only the requested content—no preamble, quotes, or markdown.'

export async function aiImproveSummary(currentSummary, jobTitle) {
  return callClaude(
    `Improve this professional summary for a ${jobTitle || 'professional'} to be more compelling and ATS-friendly. Return only the improved text:\n\n"${currentSummary}"`,
    RESUME_SYSTEM,
  )
}

export async function aiImproveBullet(bullet, role, company) {
  return callClaude(
    `Improve this resume bullet for a ${role || 'professional'} at ${company || 'a company'}. Start with a strong action verb and include a quantified metric where possible. Return only the improved bullet:\n\n"${bullet}"`,
    RESUME_SYSTEM,
  )
}

export async function aiSuggestBullets(role, company) {
  const raw = await callClaude(
    `Generate 3 strong, ATS-friendly resume bullet points for a ${role || 'professional'} at ${company || 'a company'}. Each should start with a different action verb and include a realistic metric. Return exactly 3 bullets, one per line, no numbering or dashes.`,
    RESUME_SYSTEM,
  )
  return raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 5).slice(0, 3)
}

export async function aiSuggestSkills(jobTitle, currentSkills) {
  const raw = await callClaude(
    `Suggest 6 additional ATS-friendly skills for a ${jobTitle || 'professional'}. Existing skills: ${currentSkills.join(', ')}. Return only comma-separated skill names, nothing else.`,
    RESUME_SYSTEM,
  )
  return raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6)
}

export async function aiGenerateCoverLetter({ name, title, summary, skills, experience, role, company, tone }) {
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
