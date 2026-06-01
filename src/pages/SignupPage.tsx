import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FileText } from 'lucide-react'
import { Input } from '../design/components/Field'
import Button from '../design/components/Button'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    navigate('/')
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
          <Link to="/login" className="text-terracotta hover:text-terracotta/80 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
