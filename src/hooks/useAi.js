import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Wrapper hook for AI calls with loading state + toast notifications
 */
export function useAi() {
  const [loading, setLoading] = useState({})

  const run = useCallback(async (key, asyncFn, onSuccess) => {
    setLoading((l) => ({ ...l, [key]: true }))
    try {
      const result = await asyncFn()
      onSuccess(result)
      toast.success('AI done ✦')
    } catch (err) {
      toast.error(err.message || 'AI request failed')
    } finally {
      setLoading((l) => ({ ...l, [key]: false }))
    }
  }, [])

  const isLoading = useCallback((key) => !!loading[key], [loading])

  return { run, isLoading }
}
