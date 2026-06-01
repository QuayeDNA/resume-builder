/**
 * Predefined prompt templates for AI-assisted resume and cover letter generation.
 * Each template includes system context, detailed instructions, and output format.
 */

// ═══════════════════════════════════════════════════════════════════════════
// System Messages
// ═══════════════════════════════════════════════════════════════════════════

export const RESUME_SYSTEM = `You are an expert resume writer with deep knowledge of ATS (Applicant Tracking System) optimization.
Your responses must be:
- Concise and impactful
- Action-oriented with strong verbs
- Quantified where possible
- ATS-friendly (no special formatting, symbols, or emojis)
- Professional and compelling
Return ONLY the requested content with no preamble, explanations, or markdown formatting.`

export const COVER_LETTER_SYSTEM = `You are a professional cover letter writer specializing in personalized, compelling narratives.
Your responses must be:
- Warm, authentic, and persuasive
- Specific to the role and company
- Free of generic phrases and clichés
- Concise yet detailed (3 focused paragraphs maximum)
- Professional in tone but human in voice
Return ONLY the body paragraphs with no salutation, sign-off, or preamble.`

// ═══════════════════════════════════════════════════════════════════════════
// Resume Prompts
// ═══════════════════════════════════════════════════════════════════════════

export function formatImprovesSummaryPrompt(currentSummary, jobTitle) {
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

export function formatImproveBulletPrompt(bullet, role, company) {
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

export function formatSuggestBulletsPrompt(role, company) {
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

export function formatSuggestSkillsPrompt(jobTitle, currentSkills) {
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

// ═══════════════════════════════════════════════════════════════════════════
// Cover Letter Prompts
// ═══════════════════════════════════════════════════════════════════════════

export function formatGenerateCoverLetterPrompt({
  name,
  title,
  summary,
  skills,
  experience,
  role,
  company,
  tone,
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
