'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Lightbox from '@/components/Lightbox'
import { ProofImage, proofImageUrl } from '@/lib/supabase'
import styles from './proof.module.css'

export default function ProofPage() {
  const [images, setImages] = useState<ProofImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lbIndex, setLbIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/proof')
      .then(r => r.json())
      .then(data => { setImages(data); setLoading(false) })
  }, [])

  const urls = images.map(img => proofImageUrl(img.storage_path))

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.sectionHeader}>
        <Link href="/" className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </Link>
        <h2>Client Proof</h2>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.masonry}>
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={styles.skeleton} style={{ height: `${150 + (i % 3) * 60}px` }} />)}
          </div>
        ) : images.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🖼</div>
            <h3>No proof images yet</h3>
            <p>Client proof will appear here once uploaded.</p>
          </div>
        ) : (
          <div className={styles.masonry}>
            {images.map((img, i) => (
              <div key={img.id} className={styles.item} onClick={() => setLbIndex(i)}>
                <img src={proofImageUrl(img.storage_path)} alt={`Client proof ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      {lbIndex !== null && (
        <Lightbox images={urls} index={lbIndex} onClose={() => setLbIndex(null)} onChange={setLbIndex} />
      )}
    </div>
  )
}
