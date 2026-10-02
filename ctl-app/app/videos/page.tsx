'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import VideoModal from '@/components/VideoModal'
import { Video, extractYouTubeId, youTubeThumbnail } from '@/lib/supabase'
import styles from './videos.module.css'

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filtered, setFiltered] = useState<Video[]>([])
  const [search, setSearch] = useState('')
  const [bizFilter, setBizFilter] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.json())
      .then(data => { setVideos(data); setFiltered(data); setLoading(false) })
  }, [])

  useEffect(() => {
    let result = videos
    if (search) result = result.filter(v => v.client_name.toLowerCase().includes(search.toLowerCase()) || (v.business || '').toLowerCase().includes(search.toLowerCase()))
    if (bizFilter) result = result.filter(v => v.business === bizFilter)
    setFiltered(result)
  }, [search, bizFilter, videos])

  const businesses = [...new Set(videos.map(v => v.business).filter(Boolean))] as string[]

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.sectionHeader}>
        <Link href="/" className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </Link>
        <h2>Transformation Videos</h2>
      </div>
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className={styles.searchInput} placeholder="Search by client or business..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {businesses.length > 0 && (
          <select className={styles.filterSelect} value={bizFilter} onChange={e => setBizFilter(e.target.value)}>
            <option value="">All Businesses</option>
            {businesses.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>▶</div>
          <h3>{videos.length ? 'No results found' : 'No videos yet'}</h3>
          <p>{videos.length ? 'Try a different search.' : 'Transformation videos will appear here.'}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(v => {
            const ytId = extractYouTubeId(v.youtube_url)
            const thumb = ytId ? youTubeThumbnail(ytId) : null
            return (
              <div key={v.id} className={styles.card} onClick={() => setSelectedVideo(v)}>
                <div className={styles.thumb}>
                  {thumb && <Image src={thumb} alt={v.client_name} fill style={{ objectFit: 'cover' }} sizes="(max-width:640px) 100vw, 33vw" />}
                  <div className={styles.playBtn}><div className={styles.playCircle}>▶</div></div>
                </div>
                <div className={styles.info}>
                  <div className={styles.clientName}>{v.client_name}</div>
                  <div className={styles.business}>{v.business || ''}</div>
                  <div className={styles.watchBtn}>Watch Transformation →</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
