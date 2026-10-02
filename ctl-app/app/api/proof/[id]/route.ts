import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/auth'

// DELETE — admin only, deletes image from storage + db
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get the storage path first
  const { data: row, error: fetchError } = await supabaseAdmin
    .from('proof_images')
    .select('storage_path')
    .eq('id', params.id)
    .single()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 404 })

  // Delete from storage
  await supabaseAdmin.storage.from('proof-images').remove([row.storage_path])

  // Delete from db
  const { error } = await supabaseAdmin.from('proof_images').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
