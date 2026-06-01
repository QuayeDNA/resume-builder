export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  summary: string
}

export interface ExperienceEntry {
  id: number
  company: string
  role: string
  start: string
  end: string
  location: string
  bullets: string[]
}

export interface EducationEntry {
  id: number
  school: string
  degree: string
  start: string
  end: string
  gpa: string
}

export interface ProjectEntry {
  id: number
  name: string
  url: string
  description: string
}

export interface CertificationEntry {
  id: number
  name: string
  issuer: string
  year: string
}

export interface LanguageEntry {
  id: number
  language: string
  proficiency: string
}

export interface ResumeData {
  personal: PersonalInfo
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  languages: LanguageEntry[]
  template: string
}

export interface CoverLetterData {
  recipientName: string
  company: string
  role: string
  tone: string
  body: string
}

export interface ResumeSlot {
  id: number
  name: string
  data: ResumeData
  cl: CoverLetterData
}

export interface AtsResult {
  score: number
  feedback: string[]
  verbCount: number
  metricCount: number
}

export type ActiveView = 'resume' | 'cover'
export type ActiveSection = typeof SECTION_IDS[number]
export type ProficiencyLevel = typeof PROFICIENCY_OPTIONS[number]
export type CoverLetterTone = typeof COVER_LETTER_TONES[number]

export const PROFICIENCY_OPTIONS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'] as const
export const COVER_LETTER_TONES  = ['professional', 'enthusiastic', 'concise', 'creative'] as const
export const SECTION_IDS = ['personal','experience','education','skills','projects','certifications','languages','coverletter','design','saved'] as const

export type NavItem = {
  id: ActiveSection
  label: string
  icon: string
}
