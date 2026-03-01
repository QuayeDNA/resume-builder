import { create } from 'zustand'
import { DEFAULT_RESUME, DEFAULT_COVER_LETTER } from '../utils/defaults'
import { loadResumeFromStorage, saveResumeToStorage, loadSlotsFromStorage, saveSlotsToStorage } from '../utils/storage'

const stored = loadResumeFromStorage()

const useResumeStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  data:        stored?.data || DEFAULT_RESUME,
  cl:          stored?.cl   || DEFAULT_COVER_LETTER,
  slots:       loadSlotsFromStorage(),
  activeView:  'resume',   // 'resume' | 'cover'
  activeSection: 'personal',
  savedAt:     stored?.savedAt || null,

  // ── Personal ────────────────────────────────────────────────────────────
  updatePersonal: (field, value) =>
    set((s) => ({ data: { ...s.data, personal: { ...s.data.personal, [field]: value } } })),

  // ── Experience ──────────────────────────────────────────────────────────
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

  // ── Education ────────────────────────────────────────────────────────────
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

  // ── Skills ───────────────────────────────────────────────────────────────
  setSkills: (skills) =>
    set((s) => ({ data: { ...s.data, skills } })),

  addSkills: (newSkills) =>
    set((s) => ({ data: { ...s.data, skills: [...s.data.skills, ...newSkills] } })),

  removeSkill: (idx) =>
    set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((_, i) => i !== idx) } })),

  // ── Projects ─────────────────────────────────────────────────────────────
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

  // ── Certifications ───────────────────────────────────────────────────────
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

  // ── Languages ────────────────────────────────────────────────────────────
  addLanguage: () =>
    set((s) => ({
      data: { ...s.data, languages: [...(s.data.languages || []), { id: Date.now(), language: '', proficiency: 'Native' }] },
    })),

  removeLanguage: (id) =>
    set((s) => ({ data: { ...s.data, languages: (s.data.languages || []).filter((l) => l.id !== id) } })),

  updateLanguage: (id, field, value) =>
    set((s) => ({
      data: { ...s.data, languages: (s.data.languages || []).map((l) => (l.id === id ? { ...l, [field]: value } : l)) },
    })),

  // ── Template ─────────────────────────────────────────────────────────────
  setTemplate: (templateKey) =>
    set((s) => ({ data: { ...s.data, template: templateKey } })),

  // ── Cover Letter ─────────────────────────────────────────────────────────
  updateCoverLetter: (field, value) =>
    set((s) => ({ cl: { ...s.cl, [field]: value } })),

  // ── UI State ─────────────────────────────────────────────────────────────
  setActiveView:    (view)    => set({ activeView: view }),
  setActiveSection: (section) => set({ activeSection: section }),

  // ── Slots ─────────────────────────────────────────────────────────────────
  saveToSlot: () => {
    const { data, cl, slots } = get()
    const slot = {
      id:   Date.now(),
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

  // ── Persistence ──────────────────────────────────────────────────────────
  persist: () => {
    const { data, cl } = get()
    saveResumeToStorage(data, cl)
    set({ savedAt: Date.now() })
  },

  reset: () => {
    set({ data: DEFAULT_RESUME, cl: DEFAULT_COVER_LETTER })
  },

  loadFromJSON: (parsed) => {
    if (parsed.data) set((s) => ({ data: parsed.data }))
    if (parsed.cl)   set((s) => ({ cl: parsed.cl }))
  },
}))

export default useResumeStore
