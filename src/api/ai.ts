import { callFreeAI, getConfiguredProvider, getLastProvider } from './freeAI'
import type { ExperienceEntry } from '../types'
import {
  formatImprovesSummaryPrompt,
  formatImproveBulletPrompt,
  formatSuggestBulletsPrompt,
  formatSuggestSkillsPrompt,
  formatGenerateCoverLetterPrompt,
} from './prompts'

export async function callAI(userPrompt: string, systemPrompt = '', maxTokens = 1000): Promise<string> {
  return callFreeAI(userPrompt, systemPrompt, maxTokens)
}

export function getActiveProvider(): string | null {
  return getLastProvider() || getConfiguredProvider()
}

export function getProviderLabel(): string {
  const provider = getActiveProvider()
  switch (provider) {
    case 'groq': return 'Groq'
    case 'zephyr': return 'Zephyr'
    default: return 'AI'
  }
}

export async function aiImproveSummary(currentSummary: string, jobTitle: string): Promise<string> {
  const { userPrompt, systemPrompt, maxTokens } = formatImprovesSummaryPrompt(currentSummary, jobTitle)
  return callAI(userPrompt, systemPrompt, maxTokens)
}

export async function aiImproveBullet(bullet: string, role: string, company: string): Promise<string> {
  const { userPrompt, systemPrompt, maxTokens } = formatImproveBulletPrompt(bullet, role, company)
  return callAI(userPrompt, systemPrompt, maxTokens)
}

export async function aiSuggestBullets(role: string, company: string): Promise<string[]> {
  const { userPrompt, systemPrompt, maxTokens } = formatSuggestBulletsPrompt(role, company)
  const raw = await callAI(userPrompt, systemPrompt, maxTokens)
  return raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 5).slice(0, 3)
}

export async function aiSuggestSkills(jobTitle: string, currentSkills: string[]): Promise<string[]> {
  const { userPrompt, systemPrompt, maxTokens } = formatSuggestSkillsPrompt(jobTitle, currentSkills)
  const raw = await callAI(userPrompt, systemPrompt, maxTokens)
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
  const { userPrompt, systemPrompt, maxTokens } = formatGenerateCoverLetterPrompt({
    name, title, summary, skills, experience, role, company, tone,
  })
  return callAI(userPrompt, systemPrompt, maxTokens)
}
