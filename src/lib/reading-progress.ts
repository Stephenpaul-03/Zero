export type ReadingProgress = {
  subjectId: string
  subjectLabel: string
  path: string
  slug: string
  lessonLabel: string
}

export const NOTES_PROGRESS_KEY = 'zero-notes-reading-progress'

function readStoredProgress(storageKey: string): ReadingProgress | null {
  try {
    const value = window.localStorage.getItem(storageKey)
    if (!value) return null
    const parsed = JSON.parse(value) as Partial<ReadingProgress>
    if (
      typeof parsed.subjectId !== "string"
      || typeof parsed.subjectLabel !== "string"
      || typeof parsed.path !== "string"
      || typeof parsed.slug !== "string"
      || typeof parsed.lessonLabel !== "string"
    ) return null
    return parsed as ReadingProgress
  } catch {
    return null
  }
}

export function readReadingProgress(storageKey: string): ReadingProgress | null {
  const current = readStoredProgress(storageKey)
  if (current || storageKey !== NOTES_PROGRESS_KEY) return current
  const legacy = readStoredProgress('lattice-reading-progress')
  if (!legacy) return null
  try {
    window.localStorage.setItem(NOTES_PROGRESS_KEY, JSON.stringify(legacy))
    window.localStorage.removeItem('lattice-reading-progress')
  } catch { /* Keep the saved position readable if storage is temporarily unavailable. */ }
  return legacy
}

export function saveReadingProgress(storageKey: string, progress: ReadingProgress) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress))
}

