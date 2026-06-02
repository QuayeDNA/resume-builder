'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '../store/useAuthStore'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-terracotta/30 bg-terracotta-dim">
            <div className="h-6 w-6 animate-pulse rounded-lg bg-terracotta/40" />
          </div>
          <div className="space-y-2 text-center">
            <div className="mx-auto h-5 w-40 animate-pulse rounded-full bg-warm-border-strong" />
            <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-warm-border" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
