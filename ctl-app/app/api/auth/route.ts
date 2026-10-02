import { NextRequest, NextResponse } from 'next/server'
import { setAdminCookie, clearAdminCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { action, password } = await request.json()

  if (action === 'login') {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 })
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
    const response = NextResponse.json({ ok: true })
    response.cookies.set(setAdminCookie())
    return response
  }

  if (action === 'logout') {
    const response = NextResponse.json({ ok: true })
    response.cookies.set(clearAdminCookie())
    return response
  }

  if (action === 'check') {
    const session = request.cookies.get('ctl_admin_session')
    return NextResponse.json({ isAdmin: session?.value === 'authenticated' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
