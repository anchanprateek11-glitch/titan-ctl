
# Client Transformation Library — Titan Lifestyle Hub

A Next.js + Supabase web app for showcasing client transformation videos and proof images. Content is stored in the cloud — any update you make is instantly visible to everyone who opens the link.

---

## What's inside

| Path | What it does |
|------|-------------|
| `app/` | All pages and API routes |
| `app/admin/` | Password-protected admin panel |
| `components/` | Shared UI components |
| `lib/supabase.ts` | Supabase client + helper functions |
| `lib/auth.ts` | Cookie-based admin auth |
| `supabase/schema.sql` | Database tables + storage bucket setup |
| `public/logo.png` | Titan Lifestyle Hub logo (add this yourself) |
| `public/pratiek.jpg` | Your headshot (add this yourself) |

---

## Step 1 — Add your images

Copy two files into the `public/` folder before deploying:

1. **`public/logo.png`** — The Titan Lifestyle Hub logo (black/gold shield)
2. **`public/pratiek.jpg`** — Your headshot

These are referenced directly by the app and must be present.

---

## Step 2 — Set up Supabase

1. Go to **https://supabase.com** and create a free account.
2. Click **New project**. Choose a name (e.g. `titan-ctl`) and set a database password. Pick the region closest to you (e.g. Singapore for India).
3. Wait ~2 minutes for the project to finish provisioning.

### Create the database schema

4. In the Supabase dashboard, click **SQL Editor** in the left sidebar.
5. Click **New query**.
6. Open the file `supabase/schema.sql` from this project, copy its entire contents, paste into the editor, and click **Run**.
7. You should see "Success. No rows returned." — this means all tables and the storage bucket were created.

### Get your API keys

8. Go to **Project Settings → API** in the Supabase dashboard.
9. Copy these three values — you'll need them in a moment:
   - **Project URL** (looks like `https://abcdefghijkl.supabase.co`)
   - **anon / public key** (under "Project API keys")
   - **service_role key** (click "Reveal" — keep this secret)

---

## Step 3 — Deploy to Vercel

1. Go to **https://vercel.com** and log in (or create a free account).
2. Click **Add New → Project**.
3. Connect your GitHub account and push this project to a new GitHub repo first, OR use Vercel CLI (see below).
4. Import the repo. Vercel will auto-detect it as a Next.js project.
5. Before clicking Deploy, click **Environment Variables** and add these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |
| `ADMIN_PASSWORD` | Choose a strong password (e.g. `Titan@2024!`) |

6. Click **Deploy**. Vercel will build and host the app. It takes about 1–2 minutes.
7. You'll get a URL like `https://titan-ctl.vercel.app` — this is your shareable link.

### Alternative: deploy with Vercel CLI

```bash
npm install -g vercel
cd /path/to/this/project
npm install
vercel
# Follow the prompts; add env vars when asked
```

---

## Step 4 — First login

1. Open your Vercel URL.
2. Go to `https://your-url.vercel.app/admin`
3. Enter the `ADMIN_PASSWORD` you set in step 3.
4. You're in! Start adding videos and uploading proof images.

---

## Using the admin panel

### Adding a transformation video
1. Go to `/admin` → **Videos** tab.
2. Fill in **Client Name**, **Business / Niche** (optional), and the **YouTube URL**.
3. Supported URL formats: `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`, or a bare video ID.
4. Click **Add Video**. It appears immediately on the public site.

### Uploading proof images
1. Go to `/admin` → **Proof Images** tab.
2. Click the upload zone to select images. You can select multiple at once.
3. Images are uploaded to Supabase Storage and appear immediately on the public site.

### Editing the welcome message
1. Go to `/admin` → **Settings** tab.
2. Edit the text and click **Save Message**.

---

## Updating content later

- New videos or images added in the admin panel appear on the public site immediately (no rebuild needed).
- The welcome message is fetched fresh every 60 seconds.
- If you need to update the code (design changes, new features), push to GitHub and Vercel auto-deploys.

---

## Local development (optional)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.local.example .env.local
# edit .env.local with your Supabase keys and password

# 3. Run the dev server
npm run dev
# Open http://localhost:3000
```

---

## Project structure

```
ctl-app/
├── app/
│   ├── api/
│   │   ├── auth/route.ts       # Login / logout / check
│   │   ├── videos/route.ts     # GET all, POST new
│   │   ├── videos/[id]/route.ts # PATCH, DELETE
│   │   ├── proof/route.ts      # GET all, POST upload
│   │   ├── proof/[id]/route.ts  # DELETE
│   │   └── settings/route.ts   # GET, POST (welcome message)
│   ├── admin/                  # Admin panel (password protected)
│   ├── proof/                  # Public proof gallery
│   ├── videos/                 # Public video gallery
│   ├── globals.css             # CSS design tokens
│   ├── layout.tsx              # Root layout + fonts
│   └── page.tsx                # Home page
├── components/
│   ├── Header.tsx              # Site header with admin link
│   ├── VideoModal.tsx          # YouTube embed modal
│   ├── Lightbox.tsx            # Image lightbox
│   └── *.module.css            # Component styles
├── lib/
│   ├── supabase.ts             # DB client + YouTube utils
│   └── auth.ts                 # Cookie auth helpers
├── public/
│   ├── logo.png                # ← ADD THIS
│   └── pratiek.jpg             # ← ADD THIS
├── supabase/
│   └── schema.sql              # Run this in Supabase SQL Editor
└── .env.local.example          # Copy to .env.local and fill in
```

---

## Support

Built for Titan Lifestyle Hub. For technical questions, refer to:
- **Next.js docs**: https://nextjs.org/docs
- **Supabase docs**: https://supabase.com/docs
- **Vercel docs**: https://vercel.com/docs
