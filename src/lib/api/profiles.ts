import { supabase } from '../supabase'

export type DbProfile = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  subscription_tier: string
  created_at: string
  updated_at: string
}

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('fetchProfile error:', error)
    return null
  }

  return data as DbProfile | null
}

export async function updateProfile(
  userId: string,
  updates: { name?: string; avatar_url?: string },
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) console.error('updateProfile error:', error)
  return !error
}
