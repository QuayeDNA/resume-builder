import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { fetchProfile } from '../lib/api/profiles'
import type { User, Session } from '@supabase/supabase-js'
import type { DbProfile } from '../lib/api/profiles'

export type Tier = 'free' | 'pro' | 'lifetime'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  profile: DbProfile | null
  subscriptionTier: Tier

  setUser: (user: User | null, session: Session | null) => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  loadProfile: () => Promise<void>
  init: () => Promise<void>
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  profile: null,
  subscriptionTier: 'free' as Tier,

  setUser: (user, session) => set({ user, session }),

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message || null }
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message || null }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, profile: null, subscriptionTier: 'free' })
  },

  loadProfile: async () => {
    const { user } = get()
    if (!user) return
    const profile = await fetchProfile(user.id)
    if (profile) {
      const tier = (['pro', 'lifetime'] as Tier[]).includes(profile.subscription_tier as Tier)
        ? (profile.subscription_tier as Tier)
        : 'free'
      set({ profile, subscriptionTier: tier })
    }
  },

  init: async () => {
    set({ loading: true })
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user || null
    set({ user, session, loading: false })
    if (user) {
      get().loadProfile()
    }
  },
}))

/* ─── Auth listener — keeps store in sync with Supabase ─── */
let listenerInitialized = false

export function initAuthListener() {
  if (listenerInitialized) return
  listenerInitialized = true

  useAuthStore.getState().init()

  supabase.auth.onAuthStateChange(async (event, session) => {
    const user = session?.user || null
    useAuthStore.setState({ user, session, loading: false })
    if (event === 'SIGNED_IN' && user) {
      useAuthStore.getState().loadProfile()
    }
    if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ profile: null, subscriptionTier: 'free' })
    }
  })
}

export default useAuthStore
