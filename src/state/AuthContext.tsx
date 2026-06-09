import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../lib/api/auth'
import { setUnauthorizedHandler } from '../lib/api/client'
import {
  clearAuthSession,
  getStoredUser,
  getToken,
  isTokenExpired,
  setAuthSession,
} from '../lib/api/token'
import type { AuthUser } from '../lib/api/types'

interface AuthContextValue {
  user: AuthUser | null
  initializing: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      navigate('/login', { replace: true })
    })
  }, [navigate])

  useEffect(() => {
    async function restore() {
      const token = getToken()
      if (!token || isTokenExpired()) {
        clearAuthSession()
        setUser(null)
        setInitializing(false)
        return
      }
      try {
        const me = await authApi.me()
        setUser({
          email: me.email,
          name: me.name,
          role: me.role as AuthUser['role'],
        })
      } catch {
        clearAuthSession()
        setUser(null)
      } finally {
        setInitializing(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    setAuthSession(res.access_token, res.user, res.expires_in)
    setUser(res.user)
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await authApi.register(name, email, password)
      setAuthSession(res.access_token, res.user, res.expires_in)
      setUser(res.user)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      /* token may already be invalid */
    }
    clearAuthSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
