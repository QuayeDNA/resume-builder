const ACTION_VERBS = [
  'led','built','designed','managed','improved','increased','reduced','created',
  'developed','launched','collaborated','owned','drove','delivered','spearheaded',
  'optimized','streamlined','generated','established','architected','orchestrated',
  'negotiated','mentored','scaled','deployed','automated','refactored','implemented',
]

/**
 * Calculate ATS score for a resume
 * @param {import('../types').ResumeData} data
 * @returns {import('../types').AtsResult}
 */
export function calculateAtsScore(data) {
  const { personal, experience, skills, certifications, languages } = data

  const allText = [
    personal.summary,
    ...experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...skills,
  ].join(' ').toLowerCase()

  const metrics   = allText.match(/\d+[%+k$mx]?/g) || []
  const verbCount = ACTION_VERBS.filter((v) => allText.includes(v)).length

  let score    = 0
  const feedback = []

  // Contact info (17pts)
  if (personal.email && personal.phone) { score += 12 } else { feedback.push('Add both email and phone number') }
  if (personal.linkedin)                { score += 5  } else { feedback.push('Add your LinkedIn URL') }

  // Summary (13pts)
  if (personal.summary.length > 60) { score += 13 } else { feedback.push('Write a stronger summary (at least 60 characters)') }

  // Experience (13pts)
  if (experience.length >= 1) score += 8
  if (experience.length >= 2) score += 5

  // Action verbs (20pts)
  if (verbCount >= 5)      { score += 20 }
  else if (verbCount >= 2) { score += verbCount * 3; feedback.push(`Use more action verbs (${verbCount}/5 found)`) }
  else                     { feedback.push('Add strong action verbs: led, built, drove, delivered…') }

  // Quantified achievements (20pts)
  if (metrics.length >= 5)      { score += 20 }
  else if (metrics.length >= 2) { score += metrics.length * 3; feedback.push(`Add more metrics/numbers (${metrics.length}/5 found)`) }
  else                          { feedback.push('Quantify achievements with numbers, %, $, etc.') }

  // Skills (10pts)
  const skillCount = skills.filter((s) => s.trim()).length
  if (skillCount >= 8) { score += 10 } else { feedback.push(`List at least 8 skills (you have ${skillCount})`) }

  // Bonus (7pts)
  if (certifications.length > 0)            score += 4
  if ((languages || []).length > 0)         score += 3

  return {
    score:       Math.min(score, 100),
    feedback,
    verbCount,
    metricCount: metrics.length,
  }
}

export function getScoreColor(score) {
  if (score >= 75) return '#4ade80'
  if (score >= 50) return '#fbbf24'
  return '#f87171'
}

export function getScoreLabel(score) {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Needs Work'
  return 'Poor'
}
