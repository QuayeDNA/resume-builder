import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getProviderLabel } from '../api/ai'

type LoadingState = Record<string, boolean>

export function useAi() {
  const [loading, setLoading] = useState<LoadingState>({})

  const run = useCallback(async (key: string, asyncFn: () => Promise<string | string[]>, onSuccess: (result: string | string[]) => void) => {
    setLoading((l) => ({ ...l, [key]: true }))
    try {
      const result = await asyncFn()
      onSuccess(result)
      const provider = getProviderLabel()
      toast.success(`${provider} ✦`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'AI request failed')
    } finally {
      setLoading((l) => ({ ...l, [key]: false }))
    }
  }, [])

  const isLoading = useCallback((key: string): boolean => !!loading[key], [loading])

  return { run, isLoading }
}
