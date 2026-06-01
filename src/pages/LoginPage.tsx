import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FileText } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    navigate('/')
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-void p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-subtle">
              <FileText size={24} className="text-brand" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary">Welcome back</h1>
          <p className="mt-1 text-body text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-label text-text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-subtle bg-elevated px-3.5 py-2.5 text-body text-primary placeholder:text-disabled transition-all focus:border-brand focus:ring-1 focus:ring-brand-subtle focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-label text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-subtle bg-elevated px-3.5 py-2.5 text-body text-primary placeholder:text-disabled transition-all focus:border-brand focus:ring-1 focus:ring-brand-subtle focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-error-subtle px-3 py-2 text-caption text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand px-4 py-2.5 text-body font-medium text-white transition-all hover:bg-brand-hover disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-caption text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-brand hover:text-brand-hover">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
