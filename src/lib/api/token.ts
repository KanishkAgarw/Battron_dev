import type { AuthUser } from './types'

const TOKEN_KEY = 'battron_access_token'
const USER_KEY = 'battron_user'
const EXPIRES_KEY = 'battron_token_expires_at'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function setAuthSession(
  accessToken: string,
  user: AuthUser,
  expiresIn: number,
): void {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(
    EXPIRES_KEY,
    String(Date.now() + expiresIn * 1000),
  )
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

export function isTokenExpired(): boolean {
  const exp = localStorage.getItem(EXPIRES_KEY)
  if (!exp) return false
  return Date.now() > parseInt(exp, 10)
}
