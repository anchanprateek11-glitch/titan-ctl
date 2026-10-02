import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/auth'

// GET — public, returns all videos ordered by position
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — admin only, add a video
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { client_name, business, youtube_url } = body
  if (!client_name || !youtube_url) {
    return NextResponse.json({ error: 'client_name and youtube_url required' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('videos')
    .insert({ client_name, business: business || null, youtube_url, position: 0 })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
