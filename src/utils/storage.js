const RESUME_KEY = 'resumeforge_v1'
const SLOTS_KEY  = 'resumeforge_slots_v1'

export function loadResumeFromStorage() {
  try {
    const raw = localStorage.getItem(RESUME_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveResumeToStorage(data, cl) {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify({ data, cl, savedAt: Date.now() }))
  } catch (e) {
    console.warn('Storage save failed:', e)
  }
}

export function loadSlotsFromStorage() {
  try {
    const raw = localStorage.getItem(SLOTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSlotsToStorage(slots) {
  try {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots))
  } catch (e) {
    console.warn('Slots save failed:', e)
  }
}

export function exportAsJSON(data, cl, name = 'resume') {
  const blob = new Blob([JSON.stringify({ data, cl }, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${name}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        resolve(parsed)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
