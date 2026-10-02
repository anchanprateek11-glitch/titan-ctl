'use client'
import { useEffect, useCallback } from 'react'
import styles from './Lightbox.module.css'

interface LightboxProps {
  images: string[]
  index: number
  onClose: () => void
  onChange: (i: number) => void
}

export default function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const prev = useCallback(() => onChange((index - 1 + images.length) % images.length), [index, images.length, onChange])
  const next = useCallback(() => onChange((index + 1) % images.length), [index, images.length, onChange])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler) }
  }, [onClose, prev, next])

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <button className={styles.close} onClick={onClose} aria-label="Close">×</button>

      <button className={`${styles.nav} ${styles.navPrev}`} onClick={prev} aria-label="Previous">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>

      <div className={styles.imgWrap}>
        <img
          key={index}
          src={images[index]}
          alt={`Proof ${index + 1} of ${images.length}`}
          className={styles.img}
        />
      </div>

      <button className={`${styles.nav} ${styles.navNext}`} onClick={next} aria-label="Next">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      <div className={styles.counter}>{index + 1} / {images.length}</div>
    </div>
  )
}
