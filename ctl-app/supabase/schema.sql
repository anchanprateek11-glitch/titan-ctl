-- =============================================
-- CLIENT TRANSFORMATION LIBRARY — Supabase Schema
-- Run this in: Supabase Dashboard -> SQL Editor
-- =============================================

-- 1. Transformation Videos table
create table if not exists public.videos (
  id          uuid primary key default gen_random_uuid(),
  client_name text not null,
  business    text,
  youtube_url text not null,
  position    integer default 0,
  created_at  timestamptz default now()
);

-- 2. Proof Images table
create table if not exists public.proof_images (
  id          uuid primary key default gen_random_uuid(),
  storage_path text not null,
  position    integer default 0,
  created_at  timestamptz default now()
);

-- 3. Settings table (for welcome message etc.)
create table if not exists public.settings (
  key   text primary key,
  value text
);

insert into public.settings (key, value)
values ('welcome_message', 'Welcome. Everything you''re about to see is real — real people, real journeys, real transformation. This library is my way of letting their stories speak for themselves.')
on conflict (key) do nothing;

-- =============================================
-- Row Level Security
-- =============================================

-- Videos: public read, no direct write (API route handles writes)
alter table public.videos enable row level security;
create policy "Public can read videos" on public.videos for select using (true);
create policy "Service role can write videos" on public.videos for all using (auth.role() = 'service_role');

-- Proof images: public read, no direct write
alter table public.proof_images enable row level security;
create policy "Public can read proof" on public.proof_images for select using (true);
create policy "Service role can write proof" on public.proof_images for all using (auth.role() = 'service_role');

-- Settings: public read
alter table public.settings enable row level security;
create policy "Public can read settings" on public.settings for select using (true);
create policy "Service role can write settings" on public.settings for all using (auth.role() = 'service_role');

-- =============================================
-- Storage bucket for proof images
-- =============================================
-- Run this separately in Supabase Storage section,
-- or uncomment and run here:

insert into storage.buckets (id, name, public)
values ('proof-images', 'proof-images', true)
on conflict (id) do nothing;

create policy "Public can view proof images"
  on storage.objects for select
  using (bucket_id = 'proof-images');

create policy "Service role can manage proof images"
  on storage.objects for all
  using (bucket_id = 'proof-images' and auth.role() = 'service_role');
