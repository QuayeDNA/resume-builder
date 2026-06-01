import type { ResumeData, CoverLetterData, ResumeSlot } from '../types'

const RESUME_KEY = 'resumeforge_v1'
const SLOTS_KEY = 'resumeforge_slots_v1'

type StoredSnapshot = {
  data: ResumeData
  cl: CoverLetterData
  savedAt: number
}

export function loadResumeFromStorage(): StoredSnapshot | null {
  try {
    const raw = localStorage.getItem(RESUME_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveResumeToStorage(data: ResumeData, cl: CoverLetterData): void {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify({ data, cl, savedAt: Date.now() }))
  } catch (e) {
    console.warn('Storage save failed:', e)
  }
}

export function loadSlotsFromStorage(): ResumeSlot[] {
  try {
    const raw = localStorage.getItem(SLOTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSlotsToStorage(slots: ResumeSlot[]): void {
  try {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots))
  } catch (e) {
    console.warn('Slots save failed:', e)
  }
}

export function exportAsJSON(data: ResumeData, cl: CoverLetterData, name = 'resume'): void {
  const blob = new Blob([JSON.stringify({ data, cl }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importFromJSON(file: File): Promise<{ data?: ResumeData; cl?: CoverLetterData }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        resolve(parsed)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
