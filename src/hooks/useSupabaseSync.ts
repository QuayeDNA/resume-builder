import { useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import useResumeStore from '../store/useResumeStore'
import { fetchResume, upsertResume } from '../lib/api/resumes'

const SYNC_DEBOUNCE = 2000

export function useSupabaseSync() {
  const { user } = useAuth()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!user) return
    const userId = user.id

    fetchResume(userId).then((remote) => {
      if (remote) {
        const store = useResumeStore.getState()
        const localData = store.data
        const localCL = store.cl

        const remoteUpdated = new Date(remote.updated_at).getTime()
        const localSaved = store.savedAt ?? 0

        if (remoteUpdated > localSaved && localSaved > 0) {
          useResumeStore.setState({ data: remote.data, cl: remote.cl ?? store.cl })
        }
      }
    })
  }, [user])

  useEffect(() => {
    if (!user) return

    const unsub = useResumeStore.subscribe((state) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        upsertResume(user.id, state.data, state.cl)
      }, SYNC_DEBOUNCE)
    })

    return () => {
      unsub()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [user])
}
