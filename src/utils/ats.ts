import type { ResumeData, AtsResult } from '../types'

const ACTION_VERBS = [
  'led','built','designed','managed','improved','increased','reduced','created',
  'developed','launched','collaborated','owned','drove','delivered','spearheaded',
  'optimized','streamlined','generated','established','architected','orchestrated',
  'negotiated','mentored','scaled','deployed','automated','refactored','implemented',
]

export function calculateAtsScore(data: ResumeData): AtsResult {
  const { personal, experience, skills, certifications, languages } = data

  const allText = [
    personal.summary,
    ...experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...skills,
  ].join(' ').toLowerCase()

  const metrics   = allText.match(/\d+[%+k$mx]?/g) || []
  const verbCount = ACTION_VERBS.filter((v) => allText.includes(v)).length

  let score    = 0
  const feedback: string[] = []

  if (personal.email && personal.phone) { score += 12 } else { feedback.push('Add both email and phone number') }
  if (personal.linkedin)                { score += 5  } else { feedback.push('Add your LinkedIn URL') }

  if (personal.summary.length > 60) { score += 13 } else { feedback.push('Write a stronger summary (at least 60 characters)') }

  if (experience.length >= 1) score += 8
  if (experience.length >= 2) score += 5

  if (verbCount >= 5)      { score += 20 }
  else if (verbCount >= 2) { score += verbCount * 3; feedback.push(`Use more action verbs (${verbCount}/5 found)`) }
  else                     { feedback.push('Add strong action verbs: led, built, drove, delivered…') }

  if (metrics.length >= 5)      { score += 20 }
  else if (metrics.length >= 2) { score += metrics.length * 3; feedback.push(`Add more metrics/numbers (${metrics.length}/5 found)`) }
  else                          { feedback.push('Quantify achievements with numbers, %, $, etc.') }

  const skillCount = skills.filter((s) => s.trim()).length
  if (skillCount >= 8) { score += 10 } else { feedback.push(`List at least 8 skills (you have ${skillCount})`) }

  if (certifications.length > 0)            score += 4
  if ((languages || []).length > 0)         score += 3

  return {
    score:       Math.min(score, 100),
    feedback,
    verbCount,
    metricCount: metrics.length,
  }
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#4ade80'
  if (score >= 50) return '#fbbf24'
  return '#f87171'
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Needs Work'
  return 'Poor'
}
