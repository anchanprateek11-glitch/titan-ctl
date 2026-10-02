'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Video, ProofImage, proofImageUrl } from '@/lib/supabase'
import styles from './admin.module.css'

// ─── Auth ────────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', password: pw }) })
    const data = await res.json()
    setLoading(false)
    if (data.ok) onLogin()
    else setError('Incorrect password')
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <Image src="/logo.png" alt="Titan Lifestyle Hub" width={48} height={48} />
        </div>
        <h1>Admin Access</h1>
        <p className={styles.loginSub}>Client Transformation Library</p>
        <form onSubmit={submit}>
          <input
            type="password"
            className={styles.loginInput}
            placeholder="Enter admin password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError('') }}
            autoFocus
          />
          {error && <p className={styles.loginError}>{error}</p>}
          <button className={styles.loginBtn} disabled={loading || !pw}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Video Management ─────────────────────────────────────────────────────────

function VideosPanel() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ client_name: '', business: '', youtube_url: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    const data = await fetch('/api/videos').then(r => r.json())
    setVideos(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (editId) {
      await fetch(`/api/videos/${editId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      flash('Video updated.')
    } else {
      await fetch('/api/videos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      flash('Video added.')
    }
    setForm({ client_name: '', business: '', youtube_url: '' })
    setEditId(null)
    setSaving(false)
    load()
  }

  async function del(id: string) {
    if (!confirm('Delete this video?')) return
    await fetch(`/api/videos/${id}`, { method: 'DELETE' })
    load()
  }

  function startEdit(v: Video) {
    setEditId(v.id)
    setForm({ client_name: v.client_name, business: v.business || '', youtube_url: v.youtube_url })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditId(null)
    setForm({ client_name: '', business: '', youtube_url: '' })
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Transformation Videos</h2>

      <form onSubmit={save} className={styles.form}>
        <h3 className={styles.formTitle}>{editId ? 'Edit Video' : 'Add Video'}</h3>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label>Client Name *</label>
            <input required value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} placeholder="e.g. Arjun Sharma" />
          </div>
          <div className={styles.field}>
            <label>Business / Niche</label>
            <input value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} placeholder="e.g. E-commerce" />
          </div>
        </div>
        <div className={styles.field}>
          <label>YouTube URL *</label>
          <input required value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
        </div>
        {msg && <p className={styles.success}>{msg}</p>}
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving…' : editId ? 'Update Video' : 'Add Video'}</button>
          {editId && <button type="button" className={styles.btnGhost} onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <div className={styles.list}>
        {loading ? <p className={styles.loading}>Loading…</p> : videos.length === 0 ? (
          <p className={styles.empty}>No videos yet.</p>
        ) : videos.map(v => (
          <div key={v.id} className={styles.listItem}>
            <div className={styles.listInfo}>
              <span className={styles.listName}>{v.client_name}</span>
              {v.business && <span className={styles.listSub}>{v.business}</span>}
              <span className={styles.listUrl}>{v.youtube_url}</span>
            </div>
            <div className={styles.listActions}>
              <button className={styles.btnEdit} onClick={() => startEdit(v)}>Edit</button>
              <button className={styles.btnDanger} onClick={() => del(v.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Proof Management ─────────────────────────────────────────────────────────

function ProofPanel() {
  const [images, setImages] = useState<ProofImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const data = await fetch('/api/proof').then(r => r.json())
    setImages(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      await fetch('/api/proof', { method: 'POST', body: fd })
    }
    setUploading(false)
    flash(`${files.length} image${files.length > 1 ? 's' : ''} uploaded.`)
    if (inputRef.current) inputRef.current.value = ''
    load()
  }

  async function del(id: string) {
    if (!confirm('Delete this image?')) return
    await fetch(`/api/proof/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Client Proof Images</h2>

      <div className={styles.uploadZone} onClick={() => inputRef.current?.click()}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
        <p>{uploading ? 'Uploading…' : 'Click to upload images'}</p>
        <span>PNG, JPG, WebP — multiple files allowed</span>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={upload} style={{ display: 'none' }} />
      </div>

      {msg && <p className={styles.success}>{msg}</p>}

      {loading ? <p className={styles.loading}>Loading…</p> : images.length === 0 ? (
        <p className={styles.empty}>No images yet.</p>
      ) : (
        <div className={styles.proofGrid}>
          {images.map(img => (
            <div key={img.id} className={styles.proofItem}>
              <img src={proofImageUrl(img.storage_path)} alt="Proof" loading="lazy" />
              <button className={styles.proofDelete} onClick={() => del(img.id)} aria-label="Delete">×</button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function SettingsPanel() {
  const [welcomeMsg, setWelcomeMsg] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setWelcomeMsg(data.welcome_message || '')
      setLoaded(true)
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'welcome_message', value: welcomeMsg }) })
    setSaving(false)
    setMsg('Settings saved.')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Welcome Message</h2>
      <form onSubmit={save} className={styles.form}>
        <div className={styles.field}>
          <label>Message shown on the home page</label>
          <textarea
            rows={5}
            value={welcomeMsg}
            onChange={e => setWelcomeMsg(e.target.value)}
            placeholder="Welcome! I'm so grateful you're here…"
            disabled={!loaded}
          />
        </div>
        {msg && <p className={styles.success}>{msg}</p>}
        <button type="submit" className={styles.btnPrimary} disabled={saving || !loaded}>
          {saving ? 'Saving…' : 'Save Message'}
        </button>
      </form>
    </section>
  )
}

// ─── Admin Shell ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [tab, setTab] = useState<'videos' | 'proof' | 'settings'>('videos')

  useEffect(() => {
    fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'check' }) })
      .then(r => r.json())
      .then(d => setAuthed(d.isAdmin))
  }, [])

  async function logout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    setAuthed(false)
  }

  if (authed === null) return <div className={styles.checking}>Checking access…</div>
  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <Image src="/logo.png" alt="Titan Lifestyle Hub" width={32} height={32} />
            <span className={styles.headerTitle}>Admin</span>
          </div>
          <div className={styles.headerRight}>
            <Link href="/" className={styles.viewSite}>View Site</Link>
            <button className={styles.logoutBtn} onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <div className={styles.tabs}>
        {(['videos', 'proof', 'settings'] as const).map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
            {t === 'videos' ? 'Videos' : t === 'proof' ? 'Proof Images' : 'Settings'}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'videos' && <VideosPanel />}
        {tab === 'proof' && <ProofPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  )
}
