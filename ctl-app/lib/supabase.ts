import { createClient } from '@supabase/supabase-js'

// Public client — for reading data (used in pages)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client — for writing data (used in API routes only)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ---- Types ----

export type Video = {
  id: string
  client_name: string
  business: string | null
  youtube_url: string
  position: number
  created_at: string
}

export type ProofImage = {
  id: string
  storage_path: string
  position: number
  created_at: string
}

// ---- YouTube helpers ----

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  url = url.trim()
  let m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = url.match(/\/embed\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = url.match(/\/shorts\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url
  return null
}

export function youTubeThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

export function youTubeEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`
}

// ---- Supabase Storage public URL ----
export function proofImageUrl(storagePath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/proof-images/${storagePath}`
}
