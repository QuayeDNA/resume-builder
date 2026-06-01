import { useEffect } from 'react'
import useResumeStore from '../store/useResumeStore'

/**
 * Auto-saves resume data to localStorage after a debounce delay
 * @param {number} [delay=1200] - Debounce delay in ms
 */
export function useAutoSave(delay = 1200) {
  const data    = useResumeStore((s) => s.data)
  const cl      = useResumeStore((s) => s.cl)
  const persist = useResumeStore((s) => s.persist)

  useEffect(() => {
    const timer = setTimeout(persist, delay)
    return () => clearTimeout(timer)
  }, [data, cl, delay, persist])
}
