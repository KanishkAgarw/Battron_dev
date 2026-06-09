import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { listLeads } from '../lib/api/leads'
import type { Lead, LeadListStats } from '../lib/api/types'
import { LeadCard } from '../components/LeadCard'
import { Logo } from '../components/Logo'
import { useAuth } from '../state/AuthContext'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadListStats>({ total: 0, done: 0, draft: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (search: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await listLeads({ search: search.trim() || undefined })
      setLeads(res.items)
      setStats(res.stats)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail)
      } else {
        setError('Could not load leads.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => load(query), query ? 300 : 0)
    return () => window.clearTimeout(t)
  }, [query, load])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-battron-page pb-[24px]">
      <header className="sticky top-0 z-30 flex items-center gap-[10px] bg-battron-black px-[14px] py-[10px] text-white shadow-header">
        <Logo />
        <div className="min-w-0 flex-1">
          <p className="text-14 font-bold">Leads</p>
          <p className="truncate text-11 text-battron-muted">
            {user?.name} · {user?.role}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-8 border border-battron-greenDark bg-transparent px-[10px] py-[6px] text-12 font-bold text-battron-greenBright transition-colors hover:bg-battron-ink focus:outline focus:outline-2 focus:outline-battron-green"
        >
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-container p-[12px]">
        <div className="mb-[12px] grid grid-cols-3 gap-[8px]">
          <div className="rounded-12 border border-battron-line bg-battron-card p-[12px] shadow-card">
            <p className="text-11 font-bold uppercase text-battron-slate">Total</p>
            <p className="mt-[3px] text-18 font-extrabold text-battron-summary">
              {stats.total}
            </p>
          </div>
          <div className="rounded-12 border border-battron-line bg-battron-card p-[12px] shadow-card">
            <p className="text-11 font-bold uppercase text-battron-slate">Done</p>
            <p className="mt-[3px] text-18 font-extrabold text-battron-flagOkText">
              {stats.done}
            </p>
          </div>
          <div className="rounded-12 border border-battron-line bg-battron-card p-[12px] shadow-card">
            <p className="text-11 font-bold uppercase text-battron-slate">Draft</p>
            <p className="mt-[3px] text-18 font-extrabold text-battron-readonlyText">
              {stats.draft}
            </p>
          </div>
        </div>

        <div className="mb-[12px] flex gap-[8px]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search job no., customer, mobile…"
            aria-label="Search leads"
            className="min-w-0 flex-1 rounded-10 border border-battron-line bg-battron-inputBg px-[11px] py-[10px] text-15 focus:border-battron-green focus:outline focus:outline-2 focus:outline-battron-green"
          />
          <button
            type="button"
            onClick={() => load(query)}
            className="shrink-0 rounded-10 border border-battron-line bg-battron-readonlyBg px-[12px] text-13 font-bold text-battron-btnSText transition-colors hover:brightness-95 focus:outline focus:outline-2 focus:outline-battron-green"
          >
            Refresh
          </button>
        </div>

        <Link
          to="/job-card?new=1"
          className="mb-[12px] flex w-full items-center justify-center rounded-10 border border-dashed border-battron-greenDark bg-battron-readonlyBg py-[11px] text-13 font-bold text-battron-greenDark transition-colors hover:bg-battron-line focus:outline focus:outline-2 focus:outline-battron-green"
        >
          + New job card
        </Link>

        {error && (
          <p className="mb-[12px] text-13 font-semibold text-battron-red" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center text-13 text-battron-muted">Loading leads…</p>
        ) : leads.length === 0 ? (
          <div className="rounded-14 border border-battron-line bg-battron-card p-[24px] text-center shadow-card">
            <p className="text-15 font-bold text-battron-summary">No leads yet</p>
            <p className="mt-[8px] text-13 text-battron-muted">
              Save a job card from the form to see it here as a lead.
            </p>
            <Link
              to="/job-card?new=1"
              className="mt-[16px] inline-block rounded-11 bg-battron-green px-[20px] py-[12px] text-14 font-extrabold text-battron-black focus:outline focus:outline-2 focus:outline-battron-green"
            >
              Open job card
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-[10px]">
            {leads.map((lead) => (
              <li key={lead.jcno}>
                <LeadCard lead={lead} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
