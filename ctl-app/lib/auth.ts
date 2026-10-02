import { cookies } from 'next/headers'

const SESSION_COOKIE = 'ctl_admin_session'

export function isAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  return cookieHeader.includes(`${SESSION_COOKIE}=authenticated`)
}

export function setAdminCookie() {
  // Called after successful login — sets a secure httpOnly cookie
  return {
    name: SESSION_COOKIE,
    value: 'authenticated',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  }
}

export function clearAdminCookie() {
  return {
    name: SESSION_COOKIE,
    value: '',
    maxAge: 0,
    path: '/',
  }
}
