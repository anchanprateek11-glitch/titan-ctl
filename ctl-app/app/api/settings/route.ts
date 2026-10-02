import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('settings').select('key, value')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const result: Record<string, string> = {}
  for (const row of data) result[row.key] = row.value
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { key, value } = body
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
