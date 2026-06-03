import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      resumesBuilt: 0,
      totalUsers: 0,
      coverLetters: 0,
    })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase.rpc('get_site_stats')

  if (error || !data) {
    console.error('get_site_stats error:', error?.message)
    return NextResponse.json({
      resumesBuilt: 0,
      totalUsers: 0,
      coverLetters: 0,
    })
  }

  // data is already a JSON object from the function
  const result = data as { resumesBuilt: number; totalUsers: number; coverLetters: number }

  return NextResponse.json({
    resumesBuilt: result.resumesBuilt ?? 0,
    totalUsers: result.totalUsers ?? 0,
    coverLetters: result.coverLetters ?? 0,
  })
}
