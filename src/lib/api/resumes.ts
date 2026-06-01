import { supabase } from '../supabase'
import type { ResumeData, CoverLetterData } from '../../types'

export type DbResume = {
  id: string
  user_id: string
  data: ResumeData
  cl: CoverLetterData | null
  template: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type DbSlot = {
  id: string
  user_id: string
  name: string
  data: ResumeData
  cl: CoverLetterData | null
  created_at: string
  updated_at: string
}

// ---- Resumes ----

export async function fetchResume(userId: string): Promise<DbResume | null> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('fetchResume error:', error)
    return null
  }

  return data as DbResume | null
}

export async function upsertResume(
  userId: string,
  data: ResumeData,
  cl: CoverLetterData | null,
): Promise<DbResume | null> {
  const existing = await fetchResume(userId)

  const payload = {
    user_id: userId,
    data,
    cl,
    template: data.template,
  }

  if (existing) {
    const { data: updated, error } = await supabase
      .from('resumes')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('upsertResume update error:', error)
      return null
    }
    return updated as DbResume
  }

  const { data: created, error } = await supabase
    .from('resumes')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('upsertResume insert error:', error)
    return null
  }
  return created as DbResume
}

export async function deleteResume(id: string): Promise<boolean> {
  const { error } = await supabase.from('resumes').delete().eq('id', id)
  if (error) console.error('deleteResume error:', error)
  return !error
}

// ---- Slots ----

export async function fetchSlots(userId: string): Promise<DbSlot[]> {
  const { data, error } = await supabase
    .from('resume_slots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchSlots error:', error)
    return []
  }

  return (data ?? []) as DbSlot[]
}

export async function createSlot(
  userId: string,
  name: string,
  data: ResumeData,
  cl: CoverLetterData,
): Promise<DbSlot | null> {
  const { data: slot, error } = await supabase
    .from('resume_slots')
    .insert({ user_id: userId, name, data, cl })
    .select()
    .single()

  if (error) {
    console.error('createSlot error:', error)
    return null
  }

  return slot as DbSlot
}

export async function deleteSlot(id: string): Promise<boolean> {
  const { error } = await supabase.from('resume_slots').delete().eq('id', id)
  if (error) console.error('deleteSlot error:', error)
  return !error
}
