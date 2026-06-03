import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json([])
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data } = await supabase
    .from('testimonials')
    .select('id, quote, name, role, rating, sort_order')
    .eq('visible', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}
