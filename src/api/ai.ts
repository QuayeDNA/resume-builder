import { callFreeAI, getConfiguredProvider, getLastProvider } from './freeAI'
import type { ExperienceEntry, ResumeData } from '../types'
import {
  formatImprovesSummaryPrompt,
  formatImproveBulletPrompt,
  formatSuggestBulletsPrompt,
  formatSuggestSkillsPrompt,
  formatGenerateCoverLetterPrompt,
  formatAnalyzeJobMatchPrompt,
  formatAtsSuggestionsPrompt,
} from './prompts'
import type { JobMatchResult } from './prompts'

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

export type AtsAiResult = {
  suggestions: { section: string; message: string; impact: 'high' | 'medium' | 'low' }[]
  strengths: string[]
  quickWins: string[]
}

export async function aiAtsSuggestions(data: ResumeData): Promise<AtsAiResult> {
  const { userPrompt, systemPrompt, maxTokens } = formatAtsSuggestionsPrompt({
    summary: data.personal.summary,
    skills: data.skills,
    experience: data.experience.map((e) => ({ role: e.role, company: e.company, bullets: e.bullets })),
    education: data.education.map((e) => ({ degree: e.degree, school: e.school })),
  })
  const raw = await callAI(userPrompt, systemPrompt, maxTokens)
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    return JSON.parse(cleaned) as AtsAiResult
  } catch {
    return { suggestions: [], strengths: [], quickWins: [] }
  }
}

export async function aiAnalyzeJobMatch(data: ResumeData, jobDescription: string): Promise<JobMatchResult> {
  const { userPrompt, systemPrompt, maxTokens } = formatAnalyzeJobMatchPrompt({
    resumeName: data.personal.name,
    resumeTitle: data.personal.title,
    resumeSummary: data.personal.summary,
    resumeSkills: data.skills,
    resumeExperience: data.experience.map((e) => ({ role: e.role, company: e.company, bullets: e.bullets })),
    resumeEducation: data.education.map((e) => ({ degree: e.degree, school: e.school })),
    jobDescription,
  })
  const raw = await callAI(userPrompt, systemPrompt, maxTokens)
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    return JSON.parse(cleaned) as JobMatchResult
  } catch {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      matchingSkills: [],
      suggestedSkills: [],
      bulletSuggestions: [],
      overallFeedback: 'Could not parse AI response. Please try again.',
      strongPoints: [],
      weakPoints: [],
    }
  }
}
