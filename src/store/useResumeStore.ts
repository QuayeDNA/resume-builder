import { create } from 'zustand'
import { DEFAULT_RESUME, DEFAULT_COVER_LETTER } from '../utils/defaults'
import { loadResumeFromStorage, saveResumeToStorage, loadSlotsFromStorage, saveSlotsToStorage } from '../utils/storage'
import type {
  ResumeData,
  CoverLetterData,
  ResumeSlot,
  ActiveView,
  PersonalInfo,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
  CustomSectionEntry,
} from '../types'

type StoredData = {
  data: ResumeData
  cl: CoverLetterData
  savedAt: number | null
} | null

interface ResumeStore {
  data: ResumeData
  cl: CoverLetterData
  slots: ResumeSlot[]
  activeView: ActiveView
  activeSection: string
  savedAt: number | null

  updatePersonal: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void
  addExperience: () => void
  removeExperience: (id: number) => void
  updateExperience: <K extends keyof ExperienceEntry>(id: number, field: K, value: ExperienceEntry[K]) => void
  reorderExperience: (from: number, to: number) => void
  updateBullet: (expId: number, idx: number, value: string) => void
  addBullet: (expId: number) => void
  removeBullet: (expId: number, idx: number) => void
  appendBullets: (expId: number, bullets: string[]) => void
  reorderBullets: (expId: number, from: number, to: number) => void
  addEducation: () => void
  removeEducation: (id: number) => void
  updateEducation: <K extends keyof EducationEntry>(id: number, field: K, value: EducationEntry[K]) => void
  reorderEducation: (from: number, to: number) => void
  setSkills: (skills: string[]) => void
  addSkills: (newSkills: string[]) => void
  removeSkill: (idx: number) => void
  addProject: () => void
  removeProject: (id: number) => void
  updateProject: <K extends keyof ProjectEntry>(id: number, field: K, value: ProjectEntry[K]) => void
  reorderProject: (from: number, to: number) => void
  addCertification: () => void
  removeCertification: (id: number) => void
  updateCertification: <K extends keyof CertificationEntry>(id: number, field: K, value: CertificationEntry[K]) => void
  reorderCertification: (from: number, to: number) => void
  addLanguage: () => void
  removeLanguage: (id: number) => void
  updateLanguage: <K extends keyof LanguageEntry>(id: number, field: K, value: LanguageEntry[K]) => void
  reorderLanguage: (from: number, to: number) => void
  setTemplate: (templateKey: string) => void
  updateCoverLetter: <K extends keyof CoverLetterData>(field: K, value: CoverLetterData[K]) => void
  setActiveView: (view: ActiveView) => void
  setActiveSection: (section: string) => void
  saveToSlot: () => void
  loadFromSlot: (slot: ResumeSlot) => void
  deleteSlot: (id: number) => void
  persist: () => void
  reset: () => void
  loadFromJSON: (parsed: { data?: ResumeData; cl?: CoverLetterData }) => void

  addCustomSection: () => void
  removeCustomSection: (id: number) => void
  updateCustomSection: (id: number, field: 'name' | 'description', value: string) => void
  addCustomBullet: (id: number) => void
  removeCustomBullet: (id: number, idx: number) => void
  updateCustomBullet: (id: number, idx: number, value: string) => void
  appendCustomBullets: (id: number, bullets: string[]) => void
  reorderCustomBullets: (id: number, from: number, to: number) => void
  reorderNavSection: (from: number, to: number) => void
}

const stored: StoredData = loadResumeFromStorage()

const useResumeStore = create<ResumeStore>((set, get) => ({
  data: stored?.data ?? DEFAULT_RESUME,
  cl: stored?.cl ?? DEFAULT_COVER_LETTER,
  slots: loadSlotsFromStorage(),
  activeView: 'resume',
  activeSection: 'personal',
  savedAt: stored?.savedAt ?? null,

  updatePersonal: (field, value) =>
    set((s) => ({ data: { ...s.data, personal: { ...s.data.personal, [field]: value } } })),

  addExperience: () =>
    set((s) => ({
      data: {
        ...s.data,
        experience: [...s.data.experience, { id: Date.now(), company: '', role: '', start: '', end: '', location: '', bullets: [''] }],
      },
    })),

  removeExperience: (id) =>
    set((s) => ({ data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) } })),

  updateExperience: (id, field, value) =>
    set((s) => ({
      data: { ...s.data, experience: s.data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) },
    })),

  reorderExperience: (from, to) =>
    set((s) => {
      const arr = [...s.data.experience]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return { data: { ...s.data, experience: arr } }
    }),

  updateBullet: (expId, idx, value) =>
    set((s) => ({
      data: {
        ...s.data,
        experience: s.data.experience.map((e) =>
          e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) } : e,
        ),
      },
    })),

  addBullet: (expId) =>
    set((s) => ({
      data: {
        ...s.data,
        experience: s.data.experience.map((e) => (e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e)),
      },
    })),

  removeBullet: (expId, idx) =>
    set((s) => ({
      data: {
        ...s.data,
        experience: s.data.experience.map((e) =>
          e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e,
        ),
      },
    })),

  appendBullets: (expId, bullets) =>
    set((s) => ({
      data: {
        ...s.data,
        experience: s.data.experience.map((e) =>
          e.id === expId ? { ...e, bullets: [...e.bullets, ...bullets] } : e,
        ),
      },
    })),

  reorderBullets: (expId, from, to) =>
    set((s) => ({
      data: {
        ...s.data,
        experience: s.data.experience.map((e) => {
          if (e.id !== expId) return e
          const arr = [...e.bullets]
          const [moved] = arr.splice(from, 1)
          arr.splice(to, 0, moved)
          return { ...e, bullets: arr }
        }),
      },
    })),

  addEducation: () =>
    set((s) => ({
      data: { ...s.data, education: [...s.data.education, { id: Date.now(), school: '', degree: '', start: '', end: '', gpa: '' }] },
    })),

  removeEducation: (id) =>
    set((s) => ({ data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) } })),

  updateEducation: (id, field, value) =>
    set((s) => ({
      data: { ...s.data, education: s.data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) },
    })),

  reorderEducation: (from, to) =>
    set((s) => {
      const arr = [...s.data.education]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return { data: { ...s.data, education: arr } }
    }),

  setSkills: (skills) =>
    set((s) => ({ data: { ...s.data, skills } })),

  addSkills: (newSkills) =>
    set((s) => ({ data: { ...s.data, skills: [...s.data.skills, ...newSkills] } })),

  removeSkill: (idx) =>
    set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((_, i) => i !== idx) } })),

  addProject: () =>
    set((s) => ({
      data: { ...s.data, projects: [...s.data.projects, { id: Date.now(), name: '', url: '', description: '' }] },
    })),

  removeProject: (id) =>
    set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),

  updateProject: (id, field, value) =>
    set((s) => ({
      data: { ...s.data, projects: s.data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) },
    })),

  reorderProject: (from, to) =>
    set((s) => {
      const arr = [...s.data.projects]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return { data: { ...s.data, projects: arr } }
    }),

  addCertification: () =>
    set((s) => ({
      data: { ...s.data, certifications: [...s.data.certifications, { id: Date.now(), name: '', issuer: '', year: '' }] },
    })),

  removeCertification: (id) =>
    set((s) => ({ data: { ...s.data, certifications: s.data.certifications.filter((c) => c.id !== id) } })),

  updateCertification: (id, field, value) =>
    set((s) => ({
      data: { ...s.data, certifications: s.data.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)) },
    })),

  reorderCertification: (from, to) =>
    set((s) => {
      const arr = [...s.data.certifications]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return { data: { ...s.data, certifications: arr } }
    }),

  addLanguage: () =>
    set((s) => ({
      data: { ...s.data, languages: [...(s.data.languages || []), { id: Date.now(), language: '', proficiency: 'Native' as const }] },
    })),

  removeLanguage: (id) =>
    set((s) => ({ data: { ...s.data, languages: (s.data.languages || []).filter((l) => l.id !== id) } })),

  updateLanguage: (id, field, value) =>
    set((s) => ({
      data: { ...s.data, languages: (s.data.languages || []).map((l) => (l.id === id ? { ...l, [field]: value } : l)) },
    })),

  reorderLanguage: (from, to) =>
    set((s) => {
      const arr = [...(s.data.languages || [])]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return { data: { ...s.data, languages: arr } }
    }),

  setTemplate: (templateKey) =>
    set((s) => ({ data: { ...s.data, template: templateKey } })),

  updateCoverLetter: (field, value) =>
    set((s) => ({ cl: { ...s.cl, [field]: value } })),

  setActiveView: (view) => set({ activeView: view }),
  setActiveSection: (section) => set({ activeSection: section }),

  saveToSlot: () => {
    const { data, cl, slots } = get()
    const slot: ResumeSlot = {
      id: Date.now(),
      name: `${data.personal.name || 'Resume'} — ${new Date().toLocaleDateString()}`,
      data,
      cl,
    }
    const updated = [slot, ...slots].slice(0, 10)
    saveSlotsToStorage(updated)
    set({ slots: updated })
  },

  loadFromSlot: (slot) => {
    set({ data: slot.data, cl: slot.cl })
  },

  deleteSlot: (id) => {
    const updated = get().slots.filter((s) => s.id !== id)
    saveSlotsToStorage(updated)
    set({ slots: updated })
  },

  persist: () => {
    const { data, cl } = get()
    saveResumeToStorage(data, cl)
    set({ savedAt: Date.now() })
  },

  reset: () => {
    set({ data: DEFAULT_RESUME, cl: DEFAULT_COVER_LETTER })
  },

  loadFromJSON: (parsed) => {
    if (parsed.data) set({ data: parsed.data })
    if (parsed.cl) set({ cl: parsed.cl })
  },

  addCustomSection: () => {
    const id = Date.now()
    const sectionId = `custom_${id}`
    set((s) => ({
      data: {
        ...s.data,
        customSections: [...s.data.customSections, { id, name: '', description: '', bullets: [''] }],
        sectionOrder: [...s.data.sectionOrder, sectionId],
      },
    }))
    get().setActiveSection(sectionId)
  },

  removeCustomSection: (id) => {
    const sectionId = `custom_${id}`
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.filter((c) => c.id !== id),
        sectionOrder: s.data.sectionOrder.filter((so) => so !== sectionId),
      },
    }))
  },

  updateCustomSection: (id, field, value) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      },
    })),

  addCustomBullet: (id) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === id ? { ...c, bullets: [...c.bullets, ''] } : c,
        ),
      },
    })),

  removeCustomBullet: (id, idx) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === id ? { ...c, bullets: c.bullets.filter((_, i) => i !== idx) } : c,
        ),
      },
    })),

  updateCustomBullet: (id, idx, value) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === id ? { ...c, bullets: c.bullets.map((b, i) => (i === idx ? value : b)) } : c,
        ),
      },
    })),

  appendCustomBullets: (id, bullets) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === id ? { ...c, bullets: [...c.bullets, ...bullets] } : c,
        ),
      },
    })),

  reorderCustomBullets: (id, from, to) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) => {
          if (c.id !== id) return c
          const arr = [...c.bullets]
          const [moved] = arr.splice(from, 1)
          arr.splice(to, 0, moved)
          return { ...c, bullets: arr }
        }),
      },
    })),

  reorderNavSection: (from, to) =>
    set((s) => {
      const arr = [...s.data.sectionOrder]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return { data: { ...s.data, sectionOrder: arr } }
    }),
}))

export default useResumeStore
