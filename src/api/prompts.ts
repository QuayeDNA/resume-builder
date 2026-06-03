import type { ExperienceEntry } from '../types'

export const RESUME_SYSTEM = `You are an expert resume writer with deep knowledge of ATS (Applicant Tracking System) optimization.
Your responses must be:
- Concise and impactful
- Action-oriented with strong verbs
- Quantified where possible
- ATS-friendly (no special formatting, symbols, or emojis)
- Professional and compelling
Return ONLY the requested content with no preamble, explanations, or markdown formatting.`

export const JOB_MATCH_SYSTEM = `You are an expert ATS and job-fit analyst. Analyze the resume against the job description and provide a structured assessment.
Return ONLY valid JSON — no markdown, no code fences, no preamble.`

export const COVER_LETTER_SYSTEM = `You are a professional cover letter writer specializing in personalized, compelling narratives.
Your responses must be:
- Warm, authentic, and persuasive
- Specific to the role and company
- Free of generic phrases and clichés
- Concise yet detailed (3 focused paragraphs maximum)
- Professional in tone but human in voice
Return ONLY the body paragraphs with no salutation, sign-off, or preamble.`

export function formatImprovesSummaryPrompt(currentSummary: string, jobTitle: string) {
  return {
    userPrompt: `Professional Summary to Improve (for ${jobTitle || 'professional'}):
"${currentSummary}"

Instructions:
1. Enhance with stronger action language and specificity
2. Lead with the most impressive qualifications
3. Include 1-2 key metrics or outcomes
4. Keep to 2-3 sentences maximum
5. Make it ATS-friendly and compelling

Return only the improved summary.`,
    systemPrompt: RESUME_SYSTEM,
    maxTokens: 300,
  }
}

export function formatImproveBulletPrompt(bullet: string, role: string, company: string) {
  return {
    userPrompt: `Bullet Point to Improve (${role || 'professional'} at ${company || 'company'}):
"${bullet}"

Instructions:
1. Start with a strong action verb (avoid "Responsible for", "Helped", "Involved in")
2. Include a quantifiable metric or result (percentage, $, time, scale)
3. Use specific language over vague descriptions
4. Keep to 1-2 lines maximum
5. Optimize for ATS keyword matching while maintaining impact

Return only the improved bullet point.`,
    systemPrompt: RESUME_SYSTEM,
    maxTokens: 200,
  }
}

export function formatSuggestBulletsPrompt(role: string, company: string) {
  return {
    userPrompt: `Generate 3 Strong Resume Bullets for: ${role || 'professional'} at ${company || 'company'}

Instructions:
1. Each bullet must start with a DIFFERENT action verb
2. Include realistic metrics (percentages, money saved/earned, timeline, scale)
3. Make each bullet 1-2 lines maximum
4. Use specific business impact language
5. Optimize for ATS while remaining natural
6. Bullets should be varied: one about process improvement, one about results, one about impact

Format: Return exactly 3 bullets separated by newlines. No numbering, dashes, or extra formatting.
Example format:
Increased customer retention by 23% through implementation of personalized follow-up system
Led migration of legacy monolith to microservices, reducing deployment time by 40%
Collaborated with design team to launch new product dashboard, improving user engagement by 31%`,
    systemPrompt: RESUME_SYSTEM,
    maxTokens: 400,
  }
}

export function formatSuggestSkillsPrompt(jobTitle: string, currentSkills: string[]) {
  return {
    userPrompt: `Suggest 6 ATS-Friendly Skills for: ${jobTitle || 'professional'}

Current skills already listed:
${currentSkills.join(', ')}

Instructions:
1. Suggest skills NOT already in the current list
2. Focus on in-demand technical and soft skills for this role
3. Include industry-standard terminology
4. Prioritize skills that pass ATS scanning
5. Mix technical and professional skills

Format: Return ONLY a comma-separated list of 6 skills. No explanations or numbering.
Example: Python, Machine Learning, Data Analysis, Problem Solving, Team Leadership, AWS`,
    systemPrompt: RESUME_SYSTEM,
    maxTokens: 200,
  }
}

export function formatGenerateCoverLetterPrompt({
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
}) {
  const topSkills = skills.slice(0, 5).join(', ')
  const recentExp = experience[0] ? `${experience[0].role} at ${experience[0].company}` : 'recent experience'
  const recentBullet = experience[0]?.bullets?.[0] || 'delivered impactful work'

  return {
    userPrompt: `Write a ${tone || 'professional'} Cover Letter Body for:

Applicant: ${name || 'Applicant'}
Current Title: ${title}
Applying For: ${role} at ${company}

About the Candidate:
${summary || 'A professional with strong experience and skills.'}

Top Skills: ${topSkills}
Recent Role: ${recentExp}
Key Achievement: ${recentBullet}

Instructions:
1. Write exactly 3 compelling paragraphs
2. Paragraph 1: Introduce yourself and explain why you're excited about THIS specific role at THIS company
3. Paragraph 2: Highlight 2-3 specific achievements that match the job description, using the candidate's background
4. Paragraph 3: Express enthusiasm, reinforce fit, and include a subtle call to action
5. Use the ${tone || 'professional'} tone
6. Make it personal and authentic, not generic
7. Reference company/role specifics to show research
8. Keep paragraphs concise (3-5 sentences each)

Format: Return ONLY the 3 body paragraphs separated by blank lines. No salutation, signature, or preamble.`,
    systemPrompt: COVER_LETTER_SYSTEM,
    maxTokens: 1200,
  }
}

export type JobMatchResult = {
  matchScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  matchingSkills: string[]
  suggestedSkills: string[]
  bulletSuggestions: string[]
  overallFeedback: string
  strongPoints: string[]
  weakPoints: string[]
}

const ATS_SCORE_SYSTEM = `You are an expert ATS (Applicant Tracking System) resume analyst. Your job is to analyze a resume and return a structured, role-aware assessment.

IDENTIFY the candidate's target role from their experience, title, and summary.
PROVIDE role-specific analysis — do NOT suggest generic technical keywords unless they are genuinely relevant to the candidate's field.
SCORE each category fairly based on the content provided.
SUGGESTIONS must be actionable, specific, and tied to a real gap in the resume.

Return ONLY valid JSON — no markdown, no code fences, no preamble.`

export function formatAtsScorePrompt(data: {
  name: string
  title: string
  summary: string
  skills: string[]
  experience: { role: string; company: string; bullets: string[] }[]
  education: { degree: string; school: string }[]
  certifications: string[]
  languages: { language: string; proficiency: string }[]
  customSections: { name: string; entries: { values: Record<string, string>; bullets: string[] }[] }[]
}) {
  const expText = data.experience.map((e) =>
    `- ${e.role} at ${e.company}\n  ${e.bullets.map((b) => `  • ${b}`).join('\n')}`
  ).join('\n')
  const eduText = data.education.map((e) => `- ${e.degree}, ${e.school}`).join('\n')
  const langText = data.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')
  const customText = data.customSections.map((cs) =>
    `[${cs.name}]\n${cs.entries.map((e) =>
      `${Object.values(e.values).filter(Boolean).join(', ')}${e.bullets.length ? '\n' + e.bullets.map((b) => `  • ${b}`).join('\n') : ''}`
    ).join('\n')}`
  ).join('\n\n')

  return {
    userPrompt: `Analyze this resume for ATS compatibility and return a structured JSON assessment.

RESUME:
Name: ${data.name || 'N/A'}
Current Title: ${data.title || 'N/A'}
Summary: "${data.summary || 'N/A'}"
Skills: ${data.skills.join(', ') || 'N/A'}
Experience:
${expText || 'N/A'}
Education:
${eduText || 'N/A'}
Certifications: ${data.certifications.join(', ') || 'N/A'}
Languages: ${langText || 'N/A'}
${customText ? `Custom Sections:\n${customText}` : ''}

First, identify the candidate's target role from their experience and title.
Then provide a role-aware ATS assessment.

Return JSON with this exact structure:
{
  "score": <integer 0-100 overall ATS score>,
  "feedback": ["2-3 sentence overall assessment of the resume's ATS readiness"],
  "verbCount": <count of action verbs found>,
  "metricCount": <count of quantified metrics found>,
  "categoryScores": [
    {
      "category": "contact",
      "label": "Contact Info",
      "score": <0-17>,
      "maxScore": 17,
      "feedback": ["specific feedback on contact section"]
    },
    {
      "category": "content",
      "label": "Summary & Content",
      "score": <0-18>,
      "maxScore": 18,
      "feedback": ["feedback on summary quality and content"]
    },
    {
      "category": "experience",
      "label": "Experience Quality",
      "score": <0-30>,
      "maxScore": 30,
      "feedback": ["feedback on bullet quality, action verbs, metrics"]
    },
    {
      "category": "skills",
      "label": "Skills & Keywords",
      "score": <0-15>,
      "maxScore": 15,
      "feedback": ["feedback on skill relevance and keyword coverage"]
    },
    {
      "category": "education",
      "label": "Education",
      "score": <0-10>,
      "maxScore": 10,
      "feedback": ["feedback on education section"]
    },
    {
      "category": "extras",
      "label": "Certifications & Languages",
      "score": <0-10>,
      "maxScore": 10,
      "feedback": ["feedback on extras"]
    }
  ],
  "suggestions": [
    {
      "section": "experience",
      "field": "",
      "message": "Add a bullet showing the impact of your design system on development velocity",
      "action": "improve"
    }
  ],
  "keywordDensity": {
    "relevant keyword 1": 3.5,
    "relevant keyword 2": 2.1
  }
}

CRITICAL RULES:
1. Suggestions MUST be specific to the candidate's actual role and industry — a Product Designer should get design-specific suggestions, not generic tech keywords
2. Score honestly — if contact info is missing, score low; if bullets lack metrics, score low
3. The "feedback" arrays in categoryScores should have 1-3 items each
4. "suggestions" should have 2-6 items, each with a section, message, and action
5. keywordDensity should only include keywords genuinely relevant to the candidate's field
6. verbCount counts distinct action verbs used in experience bullets
7. metricCount counts quantified achievements (numbers, %, $) in experience bullets

Return ONLY valid JSON — no markdown, no code fences, no preamble.`,
    systemPrompt: ATS_SCORE_SYSTEM,
    maxTokens: 2000,
  }
}

export function formatAtsSuggestionsPrompt(data: {
  summary: string
  skills: string[]
  experience: { role: string; company: string; bullets: string[] }[]
  education: { degree: string; school: string }[]
}) {
  const expText = data.experience.map((e) => `- ${e.role} at ${e.company}\n  ${e.bullets.map((b) => `  • ${b}`).join('\n')}`).join('\n')
  const eduText = data.education.map((e) => `- ${e.degree}, ${e.school}`).join('\n')

  return {
    userPrompt: `You are an expert ATS consultant. Review this resume and suggest improvements.

SUMMARY: ${data.summary || 'N/A'}
SKILLS: ${data.skills.join(', ')}
EXPERIENCE:
${expText || 'N/A'}
EDUCATION:
${eduText || 'N/A'}

Return valid JSON only (no markdown, no code fences) with this exact structure:
{
  "suggestions": [
    {"section": "summary" | "experience" | "skills" | "education", "message": "specific suggested improvement", "impact": "high" | "medium" | "low"}
  ],
  "strengths": ["strength1", "strength2"],
  "quickWins": ["quick win 1", "quick win 2", "quick win 3"]
}

Focus on specific, actionable improvements. Return 3-6 suggestions.`,
    systemPrompt: `You are an expert ATS resume consultant. Return ONLY valid JSON.`,
    maxTokens: 1200,
  }
}

export function formatAnalyzeJobMatchPrompt({
  resumeName, resumeTitle, resumeSummary, resumeSkills, resumeExperience, resumeEducation,
  jobDescription,
}: {
  resumeName: string
  resumeTitle: string
  resumeSummary: string
  resumeSkills: string[]
  resumeExperience: { role: string; company: string; bullets: string[] }[]
  resumeEducation: { degree: string; school: string }[]
  jobDescription: string
}) {
  const expText = resumeExperience.map((e) => `- ${e.role} at ${e.company}\n  ${e.bullets.map((b) => `  • ${b}`).join('\n')}`).join('\n')
  const eduText = resumeEducation.map((e) => `- ${e.degree}, ${e.school}`).join('\n')

  return {
    userPrompt: `Analyze this resume against the job description and return a JSON assessment.

RESUME:
Name: ${resumeName || 'N/A'}
Title: ${resumeTitle || 'N/A'}
Summary: ${resumeSummary || 'N/A'}
Skills: ${resumeSkills.join(', ')}
Experience:
${expText || 'N/A'}
Education:
${eduText || 'N/A'}

JOB DESCRIPTION:
${jobDescription}

Return JSON with exactly this structure (no markdown, no code fences):
{
  "matchScore": <0-100 integer>,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "matchingSkills": ["skill1", "skill2"],
  "suggestedSkills": ["skill3", "skill4"],
  "bulletSuggestions": ["suggested bullet 1", "suggested bullet 2", "suggested bullet 3"],
  "overallFeedback": "2-3 sentence summary of fit",
  "strongPoints": ["point1", "point2", "point3"],
  "weakPoints": ["point1", "point2", "point3"]
}`,
    systemPrompt: JOB_MATCH_SYSTEM,
    maxTokens: 1500,
  }
}
