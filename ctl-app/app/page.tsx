import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?select=key,value`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      next: { revalidate: 60 },
    })
    const rows: { key: string; value: string }[] = await res.json()
    const map: Record<string, string> = {}
    for (const r of rows) map[r.key] = r.value
    return map
  } catch {
    return {}
  }
}

export default async function HomePage() {
  const settings = await getSettings()
  const welcomeMessage = settings['welcome_message'] || 'Welcome. Everything you\'re about to see is real — real people, real journeys, real transformation.'

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Client <span>Transformation</span> Library
          </h2>
          <p className={styles.heroSub}>Real journeys. Real experiences. Real proof.</p>

          <div className={styles.founderCard}>
            <Image
              src="/pratiek.jpg"
              alt="Pratiek Anchan"
              width={88}
              height={88}
              className={styles.founderPhoto}
            />
            <div className={styles.founderMessage}>
              <div className={styles.welcomeLabel}>A Personal Note from Pratiek</div>
              <p className={styles.welcomeText}>"{welcomeMessage}"</p>
              <div className={styles.founderName}>— Pratiek Anchan, Titan Lifestyle Hub</div>
            </div>
          </div>
        </div>

        <div className={styles.sections}>
          <Link href="/videos" className={styles.sectionCard}>
            <div className={styles.icon}>▶</div>
            <h3>Transformation Videos</h3>
            <p>Watch real client journeys and transformations in their own words.</p>
            <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/proof" className={styles.sectionCard}>
            <div className={styles.icon}>🖼</div>
            <h3>Client Proof</h3>
            <p>Real messages, screenshots, and testimonials from clients.</p>
            <span className={styles.arrow}>→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
