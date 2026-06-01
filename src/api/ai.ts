/**
 * Unified AI provider for the app.
 * Priority order: Groq → Zephyr.
 */

import { callFreeAI, getConfiguredProvider, getLastProvider } from './freeAI'
import {
  formatImprovesSummaryPrompt,
  formatImproveBulletPrompt,
  formatSuggestBulletsPrompt,
  formatSuggestSkillsPrompt,
  formatGenerateCoverLetterPrompt,
} from './prompts'

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

// ── AI Helper Functions with Predefined, Structured Prompts ─────────────────
// Each function uses a prompt template that formats user input with context,
// instructions, and output format expectations.

export async function aiImproveSummary(currentSummary, jobTitle) {
  const { userPrompt, systemPrompt, maxTokens } = formatImprovesSummaryPrompt(currentSummary, jobTitle)
  return callAI(userPrompt, systemPrompt, maxTokens)
}

export async function aiImproveBullet(bullet, role, company) {
  const { userPrompt, systemPrompt, maxTokens } = formatImproveBulletPrompt(bullet, role, company)
  return callAI(userPrompt, systemPrompt, maxTokens)
}

export async function aiSuggestBullets(role, company) {
  const { userPrompt, systemPrompt, maxTokens } = formatSuggestBulletsPrompt(role, company)
  const raw = await callAI(userPrompt, systemPrompt, maxTokens)
  return raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 5).slice(0, 3)
}

export async function aiSuggestSkills(jobTitle, currentSkills) {
  const { userPrompt, systemPrompt, maxTokens } = formatSuggestSkillsPrompt(jobTitle, currentSkills)
  const raw = await callAI(userPrompt, systemPrompt, maxTokens)
  return raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6)
}

export async function aiGenerateCoverLetter({ name, title, summary, skills, experience, role, company, tone }) {
  const { userPrompt, systemPrompt, maxTokens } = formatGenerateCoverLetterPrompt({
    name,
    title,
    summary,
    skills,
    experience,
    role,
    company,
    tone,
  })
  return callAI(userPrompt, systemPrompt, maxTokens)
}
