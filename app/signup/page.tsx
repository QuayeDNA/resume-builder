'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'
import { FileText } from 'lucide-react'
import { Input } from '../../src/design/components/Field'
import Button from '../../src/design/components/Button'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/builder')
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError('')
    setOauthLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setOauthLoading(null)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-dim border border-terracotta/30">
              <FileText size={24} className="text-terracotta" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Create an account</h1>
          <p className="mt-1 text-body text-ink-soft">Start building your resume</p>
        </div>

        <div className="space-y-3">
          <Button
            variant="ghost"
            size="full"
            onClick={() => handleOAuth('google')}
            loading={oauthLoading === 'google'}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            }
          >
            Continue with Google
          </Button>

          <Button
            variant="ghost"
            size="full"
            onClick={() => handleOAuth('github')}
            loading={oauthLoading === 'github'}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/>
              </svg>
            }
          >
            Continue with GitHub
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-warm-border-strong" />
          <span className="text-caption text-ink-muted">or sign up with email</span>
          <div className="flex-1 border-t border-warm-border-strong" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-label text-ink-muted">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(v) => setEmail(v as string)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-label text-ink-muted">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(v) => setPassword(v as string)}
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-error-subtle px-3 py-2 text-caption text-error">{error}</p>
          )}

          <Button type="submit" size="full" loading={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-caption text-ink-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-terracotta hover:text-terracotta/80 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
