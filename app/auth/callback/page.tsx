'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace('/builder')
      } else {
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          // Wait briefly for the client to process the hash fragment
          await new Promise((r) => setTimeout(r, 500))
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            router.replace('/builder')
            return
          }
        }
        router.replace('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-terracotta/30 bg-terracotta-dim">
          <div className="h-6 w-6 animate-pulse rounded-lg bg-terracotta/40" />
        </div>
        <p className="text-caption text-ink-muted">Completing sign in…</p>
      </div>
    </div>
  )
}
