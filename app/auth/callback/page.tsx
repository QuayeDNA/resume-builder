'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import type { Session } from '@supabase/supabase-js'

function parseHash(hash: string): Record<string, string> {
  const params: Record<string, string> = {}
  const search = hash.replace(/^#/, '')
  for (const part of search.split('&')) {
    const [key, value] = part.split('=')
    if (key && value) params[decodeURIComponent(key)] = decodeURIComponent(value)
  }
  return params
}

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const hashParams = parseHash(window.location.hash)

      if (hashParams.access_token && hashParams.refresh_token) {
        const { data: { user } } = await supabase.auth.getUser(hashParams.access_token)
        if (user) {
          const session = {
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token,
            expires_in: Number(hashParams.expires_in) || 3600,
            expires_at: Number(hashParams.expires_at) || undefined,
            token_type: 'bearer' as const,
            user,
          } as Session

          const { error } = await supabase.auth.setSession(session)

          if (!error) {
            window.location.hash = ''
            router.replace('/builder')
            return
          }
        }
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/builder')
      } else {
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
