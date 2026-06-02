import type { ResumeData, AtsResult, AtsCategoryScore, AtsSuggestion } from '../types'

const ACTION_VERBS = [
  'led', 'built', 'designed', 'managed', 'improved', 'increased', 'reduced', 'created',
  'developed', 'launched', 'collaborated', 'owned', 'drove', 'delivered', 'spearheaded',
  'optimized', 'streamlined', 'generated', 'established', 'architected', 'orchestrated',
  'negotiated', 'mentored', 'scaled', 'deployed', 'automated', 'refactored', 'implemented',
  'accelerated', 'achieved', 'administered', 'analyzed', 'authored', 'championed',
  'composed', 'consolidated', 'coordinated', 'cultivated', 'customized', 'cut',
  'demonstrated', 'drafted', 'elevated', 'eliminated', 'enabled', 'enforced',
  'engineered', 'executed', 'expanded', 'facilitated', 'formalized', 'formulated',
  'fostered', 'guided', 'identified', 'initiated', 'instituted', 'integrated',
  'introduced', 'invented', 'investigated', 'mapped', 'modernized', 'monitored',
  'motivated', 'navigated', 'overhauled', 'pioneered', 'pivoted', 'positioned',
  'prioritized', 'produced', 'programmed', 'propelled', 'proposed', 'rebuilt',
  'reconfigured', 'recovered', 'redesigned', 'regulated', 'rehabilitated', 'reorganized',
  'replaced', 'resolved', 'restructured', 'revamped', 'revitalized', 'saved',
  'secured', 'simplified', 'solved', 'standardized', 'strengthened', 'surpassed',
  'synthesized', 'transformed', 'unified', 'upgraded', 'validated', 'won',
]

const COMMON_INDUSTRY_KEYWORDS = [
  'agile', 'api', 'aws', 'cloud', 'data', 'database', 'devops', 'docker',
  'frontend', 'backend', 'fullstack', 'kubernetes', 'microservices', 'ml',
  'pipeline', 'react', 'rest', 'sass', 'scrum', 'serverless', 'sql', 'terraform',
  'typescript', 'python', 'javascript', 'node', 'figma', 'prototype', 'wireframe',
  'user research', 'a/b testing', 'design system', 'accessibility', 'responsive',
  'cross-functional', 'stakeholder', 'roadmap', 'kpi', 'roi', 'sla',
]

export function calculateAtsScore(data: ResumeData): AtsResult {
  const { personal, experience, education, skills, certifications, languages } = data
  const categoryScores: AtsCategoryScore[] = []
  const suggestions: AtsSuggestion[] = []
  const feedback: string[] = []

  const allText = [
    personal.summary,
    ...experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...skills,
    ...education.map((e) => `${e.school} ${e.degree} ${e.gpa}`),
  ].join(' ').toLowerCase()

  const metrics = allText.match(/\d+[%+k$mx]?/g) || []

  /* ─── Contact Info (max 17) ─── */
  let contactScore = 0
  const contactFeedback: string[] = []
  if (personal.email && personal.phone) { contactScore += 12 } else { contactFeedback.push('Add both email and phone number') }
  if (personal.linkedin)                { contactScore += 5  } else { contactFeedback.push('Add your LinkedIn URL') }
  if (!contactFeedback.length) contactFeedback.push('Contact section is complete')
  categoryScores.push({ category: 'contact', label: 'Contact Info', score: contactScore, maxScore: 17, feedback: contactFeedback })
  if (contactFeedback.some((f) => !f.includes('complete'))) feedback.push(...contactFeedback.filter((f) => !f.includes('complete')))

  /* ─── Summary / Content Quality (max 18) ─── */
  let contentScore = 0
  const contentFeedback: string[] = []
  if (personal.summary.length > 60) { contentScore += 13 } else { contentFeedback.push('Write a stronger summary (at least 60 characters)') }
  if (personal.summary.length > 150) contentScore += 5
  else if (personal.summary.length > 60) contentFeedback.push('Consider expanding your summary beyond 150 characters for more impact')
  if (!contentFeedback.length) contentFeedback.push('Summary is well-written')
  categoryScores.push({ category: 'content', label: 'Summary & Content', score: contentScore, maxScore: 18, feedback: contentFeedback })
  if (contentFeedback.some((f) => !f.includes('well-written'))) feedback.push(...contentFeedback.filter((f) => !f.includes('well-written')))

  /* ─── Experience Quality (max 30) ─── */
  let expScore = 0
  const expFeedback: string[] = []
  if (experience.length >= 1) expScore += 5
  if (experience.length >= 2) expScore += 5
  else if (experience.length === 0) expFeedback.push('Add at least one work experience entry')

  const verbCount = ACTION_VERBS.filter((v) => allText.includes(v)).length
  if (verbCount >= 8) { expScore += 10 }
  else if (verbCount >= 5) { expScore += 7; expFeedback.push(`Use more action verbs (${verbCount}/8 found)`) }
  else if (verbCount >= 2) { expScore += verbCount; expFeedback.push(`Use more action verbs (${verbCount}/8 found)`) }
  else { expFeedback.push('Add strong action verbs: led, built, drove, delivered…') }

  const allBullets = experience.flatMap((e) => e.bullets)
  const verbStartCount = allBullets.filter((b) => ACTION_VERBS.some((v) => b.trim().toLowerCase().startsWith(v))).length
  const metricBulletCount = allBullets.filter((b) => /\d+/.test(b)).length
  const longBullets = allBullets.filter((b) => b.length > 120).length
  const shortBullets = allBullets.filter((b) => b.trim().length > 0 && b.trim().length < 30).length

  if (allBullets.length > 0) {
    const verbStartRatio = verbStartCount / allBullets.length
    if (verbStartRatio >= 0.6) expScore += 5
    else if (verbStartRatio >= 0.3) { expScore += 3; expFeedback.push(`Start more bullets with strong action verbs (${Math.round(verbStartRatio * 100)}% of bullets do)`) }
    else { expFeedback.push('Most bullets should start with a strong action verb') }

    const metricRatio = metricBulletCount / allBullets.length
    if (metricRatio >= 0.5) expScore += 5
    else if (metricRatio >= 0.25) { expScore += 2; expFeedback.push(`Add quantified results to more bullets (${Math.round(metricRatio * 100)}% have metrics)`) }
    else { expFeedback.push('Quantify achievements with numbers, %, $, etc.') }

    if (longBullets > 0) expFeedback.push(`${longBullets} bullet(s) are over 120 characters — consider tightening`)
    if (shortBullets > 0) expFeedback.push(`${shortBullets} bullet(s) are under 30 characters — add more detail`)
  } else if (experience.length > 0) {
    expFeedback.push('Add bullet points to your experience entries')
  }

  if (!expFeedback.length || (expFeedback.length === 1 && expFeedback[0].includes('verbs'))) {
    const verbTarget = verbCount >= 8 ? 'Experience section is strong' : ''
    if (verbTarget) expFeedback.push(verbTarget)
  }
  if (expFeedback.length === 0) expFeedback.push('Experience section is well-optimized')
  categoryScores.push({ category: 'experience', label: 'Experience Quality', score: Math.min(expScore, 30), maxScore: 30, feedback: expFeedback })
  const expIssues = expFeedback.filter((f) => !f.includes('well-optimized'))
  feedback.push(...expIssues)

  /* ─── Skills (max 15) ─── */
  let skillScore = 0
  const skillFeedback: string[] = []
  const skillCount = skills.filter((s) => s.trim()).length
  if (skillCount >= 12) { skillScore += 10; skillFeedback.push(`Strong skill count (${skillCount})`) }
  else if (skillCount >= 8) { skillScore += 8; skillFeedback.push(`Good skill count (${skillCount}) — consider adding more`) }
  else if (skillCount >= 5) { skillScore += 5; skillFeedback.push(`List more skills (you have ${skillCount}, aim for 8+)`) }
  else { skillFeedback.push(`List at least 8 skills (you have ${skillCount})`) }

  const techKeywords = COMMON_INDUSTRY_KEYWORDS.filter((kw) => allText.includes(kw))
  if (techKeywords.length >= 5) skillScore += 5
  else if (techKeywords.length >= 3) { skillScore += 3; skillFeedback.push('Add more industry-relevant keywords to your skills section') }
  else { skillFeedback.push('Include more relevant technical skills and tools') }

  categoryScores.push({ category: 'skills', label: 'Skills & Keywords', score: Math.min(skillScore, 15), maxScore: 15, feedback: skillFeedback })
  feedback.push(...skillFeedback.filter((f) => !f.includes('count')))
  const missingSkills = COMMON_INDUSTRY_KEYWORDS.filter((kw) => !allText.includes(kw)).slice(0, 6)
  if (missingSkills.length > 0) {
    suggestions.push({
      section: 'skills', field: 'skills',
      message: `Consider adding relevant keywords: ${missingSkills.join(', ')}`,
      action: 'add',
    })
  }

  /* ─── Education (max 10) ─── */
  let eduScore = 0
  const eduFeedback: string[] = []
  if (education.length >= 1) eduScore += 6
  if (education.length >= 2) eduScore += 4
  if (education.length === 0) eduFeedback.push('Add your education background')
  if (!eduFeedback.length) eduFeedback.push('Education section is complete')
  categoryScores.push({ category: 'education', label: 'Education', score: eduScore, maxScore: 10, feedback: eduFeedback })
  feedback.push(...eduFeedback.filter((f) => !f.includes('complete')))

  /* ─── Extras (max 10) ─── */
  let extrasScore = 0
  const extrasFeedback: string[] = []
  if (certifications.length > 0) extrasScore += 5
  if ((languages || []).length > 0) extrasScore += 5
  if (certifications.length === 0 && (!languages || languages.length === 0)) extrasFeedback.push('Add certifications or languages to stand out')
  if (!extrasFeedback.length) extrasFeedback.push('Certifications and languages listed')
  categoryScores.push({ category: 'extras', label: 'Certifications & Languages', score: extrasScore, maxScore: 10, feedback: extrasFeedback })
  feedback.push(...extrasFeedback.filter((f) => !f.includes('listed')))

  /* ─── Keyword Density ─── */
  const wordCount = allText.split(/\s+/).length
  const keywordDensity: Record<string, number> = {}
  for (const kw of COMMON_INDUSTRY_KEYWORDS) {
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = allText.match(regex)
    if (matches && matches.length >= 2) {
      keywordDensity[kw] = Math.round((matches.length / wordCount) * 1000) / 10
    }
  }

  /* ─── Total Score ─── */
  const totalScore = Math.min(contactScore + contentScore + Math.min(expScore, 30) + Math.min(skillScore, 15) + eduScore + extrasScore, 100)
  const totalFeedback = feedback.length > 0 ? feedback : ['Your resume looks excellent!']

  return {
    score: totalScore,
    feedback: totalFeedback,
    verbCount,
    metricCount: metrics.length,
    categoryScores,
    suggestions,
    keywordDensity,
  }
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#4ade80'
  if (score >= 50) return '#fbbf24'
  if (score >= 30) return '#fb923c'
  return '#f87171'
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Needs Work'
  return 'Poor'
}
