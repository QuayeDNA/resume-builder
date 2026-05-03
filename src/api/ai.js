/**
 * Unified AI provider for the app.
 * Priority order: Groq → Zephyr.
 */

import { callFreeAI, getConfiguredProvider, getLastProvider } from './freeAI'

/**
 * Call the best available AI provider with automatic fallback.
 * @param {string} userPrompt
 * @param {string} [systemPrompt]
 * @param {number} [maxTokens]
 * @returns {Promise<string>}
 */
export async function callAI(userPrompt, systemPrompt = '', maxTokens = 1000) {
  return callFreeAI(userPrompt, systemPrompt, maxTokens)
}

/**
 * Returns which provider is currently active.
 * @returns {'groq' | 'zephyr' | null}
 */
export function getActiveProvider() {
  return getLastProvider() || getConfiguredProvider()
}

/**
 * Returns a human-readable provider label.
 */
export function getProviderLabel() {
  const provider = getActiveProvider()
  switch (provider) {
    case 'groq': return 'Groq'
    case 'zephyr': return 'Zephyr'
    default: return 'AI'
  }
}

// ── Re-export all prompt helpers using the unified callAI ──────────────────

const RESUME_SYSTEM = 'You are an expert resume writer. Be concise, impactful, and ATS-optimized. Return only the requested content—no preamble, quotes, or markdown.'

export async function aiImproveSummary(currentSummary, jobTitle) {
  return callAI(
    `Improve this professional summary for a ${jobTitle || 'professional'} to be more compelling and ATS-friendly. Return only the improved text:\n\n"${currentSummary}"`,
    RESUME_SYSTEM,
  )
}

export async function aiImproveBullet(bullet, role, company) {
  return callAI(
    `Improve this resume bullet for a ${role || 'professional'} at ${company || 'a company'}. Start with a strong action verb and include a quantified metric where possible. Return only the improved bullet:\n\n"${bullet}"`,
    RESUME_SYSTEM,
  )
}

export async function aiSuggestBullets(role, company) {
  const raw = await callAI(
    `Generate 3 strong, ATS-friendly resume bullet points for a ${role || 'professional'} at ${company || 'a company'}. Each should start with a different action verb and include a realistic metric. Return exactly 3 bullets, one per line, no numbering or dashes.`,
    RESUME_SYSTEM,
  )
  return raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 5).slice(0, 3)
}

export async function aiSuggestSkills(jobTitle, currentSkills) {
  const raw = await callAI(
    `Suggest 6 additional ATS-friendly skills for a ${jobTitle || 'professional'}. Existing skills: ${currentSkills.join(', ')}. Return only comma-separated skill names, nothing else.`,
    RESUME_SYSTEM,
  )
  return raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6)
}

export async function aiGenerateCoverLetter({ name, title, summary, skills, experience, role, company, tone }) {
  return callAI(
    `Write a ${tone || 'professional'} cover letter body for ${name || 'the applicant'} applying for ${role || 'the role'} at ${company || 'the company'}.

Applicant background: ${title}. ${summary}
Top skills: ${skills.slice(0, 6).join(', ')}
Recent experience: ${experience[0]?.role || ''} at ${experience[0]?.company || ''}: ${experience[0]?.bullets?.[0] || ''}

Write exactly 3 compelling paragraphs. Do NOT include salutation or sign-off. Return only the body paragraphs.`,
    'You are a professional cover letter writer. Be persuasive, specific, and avoid generic phrases.',
    1200,
  )
}
