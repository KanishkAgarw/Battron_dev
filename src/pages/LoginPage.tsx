import { FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { Logo } from '../components/Logo'
import { useAuth } from '../state/AuthContext'

export function LoginPage() {
  const { user, login, initializing } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-battron-page">
        Loading…
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail)
      } else {
        setError('Could not sign in. Is the API running?')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-battron-page">
      <header className="flex items-center gap-[10px] bg-battron-black px-[14px] py-[10px] text-white shadow-header">
        <Logo />
        <span className="text-14 font-bold">Battron Service Platform</span>
      </header>

      <main className="mx-auto flex w-full max-w-container flex-1 flex-col justify-center p-[12px] py-[32px]">
        <div className="rounded-14 border border-battron-line bg-battron-card p-[20px] shadow-card">
          <h1 className="text-18 font-extrabold text-battron-summary">Sign in</h1>
          <p className="mt-[6px] text-13 text-battron-muted">
            Access your leads dashboard and job cards.
          </p>

          <form onSubmit={handleSubmit} className="mt-[20px] flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="email" className="text-12 font-semibold text-battron-slate">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@battron.com"
                className="w-full rounded-10 border border-battron-line bg-battron-inputBg px-[11px] py-[10px] text-15 text-[#1c1c1c] focus:border-battron-green focus:outline focus:outline-2 focus:outline-battron-green"
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="password"
                className="text-12 font-semibold text-battron-slate"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-10 border border-battron-line bg-battron-inputBg px-[11px] py-[10px] text-15 text-[#1c1c1c] focus:border-battron-green focus:outline focus:outline-2 focus:outline-battron-green"
              />
            </div>

            {error && (
              <p className="text-13 font-semibold text-battron-red" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-11 border-0 bg-battron-green py-[13px] text-14 font-extrabold text-battron-black transition-colors hover:brightness-105 focus:outline focus:outline-2 focus:outline-battron-green disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-[16px] text-center text-13 text-battron-muted">
            No account?{' '}
            <Link
              to="/register"
              className="font-bold text-battron-greenDark hover:text-battron-summary focus:outline focus:outline-2 focus:outline-battron-green"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
