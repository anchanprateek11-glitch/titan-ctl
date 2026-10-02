'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'check' }) })
      .then(r => r.json())
      .then(d => setIsAdmin(d.isAdmin))
  }, [pathname])

  async function logout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    setIsAdmin(false)
    router.push('/')
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <Image src="/logo.png" alt="Titan Lifestyle Hub" width={38} height={38} className={styles.logo} />
        <div className={styles.brandText}>
          <h1>Client Transformation Library</h1>
          <span>Titan Lifestyle Hub</span>
        </div>
      </Link>
      <div className={styles.right}>
        {isAdmin ? (
          <>
            <span className={styles.adminBadge}>ADMIN</span>
            <Link href="/admin" className={styles.btnGold}>Admin Panel</Link>
            <button className={styles.btnGhost} onClick={logout}>Log Out</button>
          </>
        ) : (
          <Link href="/admin" className={styles.btnGhost}>Admin</Link>
        )}
      </div>
    </header>
  )
}
