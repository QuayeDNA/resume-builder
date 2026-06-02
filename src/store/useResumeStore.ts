import { create } from 'zustand'
import { DEFAULT_RESUME, DEFAULT_COVER_LETTER } from '../utils/defaults'
import { loadResumeFromStorage, saveResumeToStorage, loadSlotsFromStorage, saveSlotsToStorage } from '../utils/storage'
import type { TemplateTheme } from '../Templates/theme'
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
  CustomSection,
} from '../types'

type HistoryEntry = { data: ResumeData; cl: CoverLetterData }

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
  undoStack: HistoryEntry[]
  redoStack: HistoryEntry[]

  undo: () => void
  redo: () => void

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
  setAtsMode: (atsMode: boolean) => void
  toggleSectionVisibility: (sectionId: string) => void
  updateThemeOverride: <K extends keyof TemplateTheme>(key: K, value: Partial<TemplateTheme[K]>) => void
  resetThemeOverrides: () => void
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
  updateCustomSectionName: (id: number, name: string) => void
  updateCustomSectionEntryLabel: (id: number, entryLabel: string) => void
  addCustomField: (sectionId: number, field: { key: string; label: string; type: 'text' | 'textarea' }) => void
  removeCustomField: (sectionId: number, key: string) => void
  updateCustomField: (sectionId: number, key: string, updates: { label?: string; type?: 'text' | 'textarea' }) => void
  addCustomEntry: (sectionId: number) => void
  removeCustomEntry: (sectionId: number, entryId: number) => void
  updateCustomEntryValue: (sectionId: number, entryId: number, fieldKey: string, value: string) => void
  addCustomBullet: (sectionId: number, entryId: number) => void
  removeCustomBullet: (sectionId: number, entryId: number, idx: number) => void
  updateCustomBullet: (sectionId: number, entryId: number, idx: number, value: string) => void
  reorderCustomEntries: (sectionId: number, from: number, to: number) => void
  reorderNavSection: (from: number, to: number) => void
  exportDialogOpen: boolean
  setExportDialogOpen: (open: boolean) => void
}

const MAX_HISTORY = 50

/* ─── Data migration: merge stored data with defaults to fill missing fields ─── */
export function migrateData(data: ResumeData): ResumeData {
  return { ...DEFAULT_RESUME, ...data, hiddenSections: data.hiddenSections ?? [] }
}

const stored: StoredData = loadResumeFromStorage()

let isUndoingOrRedoing = false
let isPushingHistory = false

const useResumeStore = create<ResumeStore>((set, get) => ({
  data: stored?.data ? migrateData(stored.data) : DEFAULT_RESUME,
  cl: stored?.cl ?? DEFAULT_COVER_LETTER,
  slots: loadSlotsFromStorage(),
  activeView: 'resume',
  activeSection: 'personal',
  savedAt: stored?.savedAt ?? null,
  undoStack: [],
  redoStack: [],
  exportDialogOpen: false,
  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),

  undo: () => {
    const { undoStack, redoStack, data, cl } = get()
    if (undoStack.length === 0) return
    const entry = undoStack[undoStack.length - 1]
    isUndoingOrRedoing = true
    set({
      data: entry.data,
      cl: entry.cl,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, { data, cl }],
    })
    isUndoingOrRedoing = false
  },

  redo: () => {
    const { undoStack, redoStack, data, cl } = get()
    if (redoStack.length === 0) return
    const entry = redoStack[redoStack.length - 1]
    isUndoingOrRedoing = true
    set({
      data: entry.data,
      cl: entry.cl,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, { data, cl }],
    })
    isUndoingOrRedoing = false
  },

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
    set((s) => ({ data: { ...s.data, template: templateKey, themeOverrides: {} } })),

  setAtsMode: (atsMode) =>
    set((s) => ({ data: { ...s.data, atsMode } })),

  toggleSectionVisibility: (sectionId) =>
    set((s) => {
      const hidden = s.data.hiddenSections || []
      const isHidden = hidden.includes(sectionId)
      return {
        data: {
          ...s.data,
          hiddenSections: isHidden
            ? hidden.filter((id) => id !== sectionId)
            : [...hidden, sectionId],
        },
      }
    }),

  updateThemeOverride: (key, value) =>
    set((s) => ({
      data: {
        ...s.data,
        themeOverrides: {
          ...(s.data.themeOverrides || {}),
          [key]: value,
        },
      },
    })),

  resetThemeOverrides: () =>
    set((s) => ({ data: { ...s.data, themeOverrides: {} } })),

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
    set({ data: migrateData(slot.data), cl: slot.cl })
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
    if (parsed.data) set({ data: migrateData(parsed.data) })
    if (parsed.cl) set({ cl: parsed.cl })
  },

  addCustomSection: () => {
    const id = Date.now()
    const sectionId = `custom_${id}`
    set((s) => ({
      data: {
        ...s.data,
        customSections: [
          ...s.data.customSections,
          {
            id,
            name: 'New Section',
            entryLabel: 'Item',
            fields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
            entries: [],
          },
        ],
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

  updateCustomSectionName: (id, name) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) => (c.id === id ? { ...c, name } : c)),
      },
    })),

  updateCustomSectionEntryLabel: (id, entryLabel) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) => (c.id === id ? { ...c, entryLabel } : c)),
      },
    })),

  addCustomField: (sectionId, field) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId ? { ...c, fields: [...c.fields, field] } : c,
        ),
      },
    })),

  removeCustomField: (sectionId, key) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? { ...c, fields: c.fields.filter((f) => f.key !== key), entries: c.entries.map((e) => {
                const { [key]: _, ...rest } = e.values
                return { ...e, values: rest }
              })}
            : c,
        ),
      },
    })),

  updateCustomField: (sectionId, key, updates) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? { ...c, fields: c.fields.map((f) => (f.key === key ? { ...f, ...updates } : f)) }
            : c,
        ),
      },
    })),

  addCustomEntry: (sectionId) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? { ...c, entries: [...c.entries, { id: Date.now(), values: {}, bullets: [] }] }
            : c,
        ),
      },
    })),

  removeCustomEntry: (sectionId, entryId) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? { ...c, entries: c.entries.filter((e) => e.id !== entryId) }
            : c,
        ),
      },
    })),

  updateCustomEntryValue: (sectionId, entryId, fieldKey, value) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? {
                ...c,
                entries: c.entries.map((e) =>
                  e.id === entryId ? { ...e, values: { ...e.values, [fieldKey]: value } } : e,
                ),
              }
            : c,
        ),
      },
    })),

  addCustomBullet: (sectionId, entryId) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? {
                ...c,
                entries: c.entries.map((e) =>
                  e.id === entryId ? { ...e, bullets: [...e.bullets, ''] } : e,
                ),
              }
            : c,
        ),
      },
    })),

  removeCustomBullet: (sectionId, entryId, idx) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? {
                ...c,
                entries: c.entries.map((e) =>
                  e.id === entryId ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e,
                ),
              }
            : c,
        ),
      },
    })),

  updateCustomBullet: (sectionId, entryId, idx, value) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) =>
          c.id === sectionId
            ? {
                ...c,
                entries: c.entries.map((e) =>
                  e.id === entryId
                    ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) }
                    : e,
                ),
              }
            : c,
        ),
      },
    })),

  reorderCustomEntries: (sectionId, from, to) =>
    set((s) => ({
      data: {
        ...s.data,
        customSections: s.data.customSections.map((c) => {
          if (c.id !== sectionId) return c
          const arr = [...c.entries]
          const [moved] = arr.splice(from, 1)
          arr.splice(to, 0, moved)
          return { ...c, entries: arr }
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

/* ─── Auto-history: push snapshot to undoStack on every data/cl mutation ─── */

let prevSnapshot: HistoryEntry | null = null

useResumeStore.subscribe((state) => {
  if (isUndoingOrRedoing || isPushingHistory) return
  if (prevSnapshot && (state.data !== prevSnapshot.data || state.cl !== prevSnapshot.cl)) {
    isPushingHistory = true
    const s = useResumeStore.getState()
    useResumeStore.setState({
      undoStack: [...s.undoStack.slice(-(MAX_HISTORY - 1)), prevSnapshot],
      redoStack: [],
    })
    isPushingHistory = false
  }
  prevSnapshot = { data: state.data, cl: state.cl }
})

export default useResumeStore
