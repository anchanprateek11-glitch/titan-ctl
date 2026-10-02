'use client'
import { useEffect } from 'react'
import { Video, extractYouTubeId, youTubeEmbedUrl } from '@/lib/supabase'
import styles from './VideoModal.module.css'

export default function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const ytId = extractYouTubeId(video.youtube_url)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler) }
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h3>{video.client_name}</h3>
            {video.business && <span>{video.business}</span>}
          </div>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        <div className={styles.embedWrap}>
          {ytId ? (
            <iframe
              src={youTubeEmbedUrl(ytId)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className={styles.fallback}>
              <p>This video cannot be embedded.</p>
              <a href={video.youtube_url} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
