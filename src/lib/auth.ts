const SESSION_KEY = 'battron_session'

export interface AuthUser {
  email: string
  name: string
  role: 'admin' | 'technician'
}

interface Session {
  user: AuthUser
  loggedInAt: string
}

/** Demo accounts — replace with API auth when a backend exists. */
const DEMO_USERS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: 'admin@battron.com',
    password: 'battron123',
    user: { email: 'admin@battron.com', name: 'Admin', role: 'admin' },
  },
  {
    email: 'tech@battron.com',
    password: 'tech123',
    user: { email: 'tech@battron.com', name: 'Technician', role: 'technician' },
  },
]

export function login(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase()
  const match = DEMO_USERS.find(
    (u) => u.email === normalized && u.password === password,
  )
  if (!match) return null
  const session: Session = {
    user: match.user,
    loggedInAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* ignore */
  }
  return match.user
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    return session?.user ?? null
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}
