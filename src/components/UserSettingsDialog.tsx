'use client'

import { useState } from 'react'
import { X, User, LogOut, Settings, Sun, Moon, Monitor } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

type Tab = 'account' | 'preferences'

type UserSettingsDialogProps = {
  open: boolean
  onClose: () => void
}

export default function UserSettingsDialog({ open, onClose }: UserSettingsDialogProps) {
  const { user, profile, signOut } = useAuthStore()
  const [tab, setTab] = useState<Tab>('account')

  if (!open) return null

  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url
  const userName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  const userEmail = user?.email || ''

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-warm-border bg-paper-warm shadow-card-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-warm-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-terracotta" />
            <h2 className="font-display text-base font-bold text-ink">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink"
            aria-label="Close dialog"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-warm-border px-5">
          <button
            onClick={() => setTab('account')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-caption font-medium transition-all duration-150 ${
              tab === 'account'
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <User size={13} />
            Account
          </button>
          <button
            onClick={() => setTab('preferences')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-caption font-medium transition-all duration-150 ${
              tab === 'preferences'
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Settings size={13} />
            Preferences
          </button>
        </div>

        {/* Tab content */}
        <div className="px-5 py-5">
          {tab === 'account' && (
            <div className="space-y-5">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-warm-border-strong bg-paper-deep text-ink-muted overflow-hidden shadow-soft">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User size={28} />
                  )}
                </div>
              </div>

              {/* Name */}
              {userName && (
                <div className="text-center">
                  <p className="font-display text-lg font-semibold text-ink">{userName}</p>
                </div>
              )}

              {/* Email */}
              <div className="rounded-xl border border-warm-border-strong bg-paper px-4 py-3">
                <p className="text-label text-ink-muted uppercase">Email</p>
                <p className="mt-0.5 text-body text-ink">{userEmail}</p>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-error-subtle px-4 py-2.5 text-caption font-medium text-error transition-all duration-200 hover:border-error/50 hover:bg-error/10 active:scale-[0.97]"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}

          {tab === 'preferences' && (
            <div className="space-y-4">
              <p className="text-label text-ink-muted uppercase">Appearance</p>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'system', icon: Monitor, label: 'System' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    disabled
                    className="flex flex-col items-center gap-2 rounded-xl border border-warm-border-strong bg-paper px-3 py-3.5 text-ink-muted opacity-60 transition-all duration-200"
                  >
                    <Icon size={18} />
                    <span className="text-caption font-medium">{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-caption text-ink-muted text-center">Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
