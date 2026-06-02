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

export interface CustomField {
  key: string
  label: string
  type: 'text' | 'textarea'
}

export interface CustomSectionEntry {
  id: number
  values: Record<string, string>
  bullets: string[]
}

export interface CustomSection {
  id: number
  name: string
  entryLabel: string
  fields: CustomField[]
  entries: CustomSectionEntry[]
}

export interface ResumeData {
  personal: PersonalInfo
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  languages: LanguageEntry[]
  customSections: CustomSection[]
  sectionOrder: string[]
  template: string
  atsMode: boolean
  hiddenSections: string[]
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
  categoryScores: AtsCategoryScore[]
  suggestions: AtsSuggestion[]
  keywordDensity: Record<string, number>
}

export interface AtsCategoryScore {
  category: string
  label: string
  score: number
  maxScore: number
  feedback: string[]
}

export interface AtsSuggestion {
  section: string
  field: string
  message: string
  action: 'add' | 'improve' | 'restructure'
}

export type ActiveView = 'resume' | 'cover'
export type ProficiencyLevel = typeof PROFICIENCY_OPTIONS[number]
export type CoverLetterTone = typeof COVER_LETTER_TONES[number]

export const PROFICIENCY_OPTIONS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'] as const
export const COVER_LETTER_TONES  = ['professional', 'enthusiastic', 'concise', 'creative'] as const

export const BUILTIN_SECTION_IDS = ['personal','experience','education','skills','projects','certifications','languages'] as const
export const TOOL_SECTION_IDS = ['coverletter','design','saved'] as const
export const ALL_SECTION_IDS = [...BUILTIN_SECTION_IDS, ...TOOL_SECTION_IDS] as const
