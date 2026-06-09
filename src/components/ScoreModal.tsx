import { useEffect, useState } from 'react'
import * as jobsApi from '../lib/api/jobs'
import type { ApiScoreResult } from '../lib/api/types'
import { useJobCard } from '../state/JobCardContext'
import { GradeChip } from './GradeChip'
import { MetricCard } from './MetricCard'
import { FlagRow } from './FlagRow'

interface ScoreModalProps {
  open: boolean
  onClose: () => void
}

const BTN = 'flex-1 rounded-11 px-[8px] py-[13px] text-14 font-extrabold'

export function ScoreModal({ open, onClose }: ScoreModalProps) {
  const { data, fetchScorePreview } = useJobCard()
  const [score, setScore] = useState<ApiScoreResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setScore(null)
      setError('')
      return
    }
    let cancelled = false
    setLoading(true)
    fetchScorePreview()
      .then((s) => {
        if (!cancelled) setScore(s)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load score.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, fetchScorePreview])

  if (!open) return null

  const f = data.fields
  const s = score
  const outcomeLine = s?.outcome_line || (f.outcome !== '—' ? f.outcome : '')

  const whatsapp = async () => {
    try {
      const res = await jobsApi.shareScore(f.jcno)
      window.open(res.whatsapp_url, '_blank')
    } catch {
      if (s) {
        const t =
          '*Battron Battery Score*\n' +
          f.jcno +
          '\nGrade *' +
          s.grade +
          '* · ' +
          s.score +
          '/100\nSoH ' +
          (s.soh || '—') +
          '% · ΔV ' +
          (s.dv != null ? s.dv + 'mV' : '—') +
          '\nRange ' +
          s.range +
          '\nResale: ' +
          s.resale +
          '\n' +
          (s.fit_for_resale ? 'Fit for resale' : 'Not for resale') +
          '\nUnderwriting: ' +
          s.underwriting.text
        window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div className="w-full max-w-container max-h-[92vh] overflow-auto rounded-t-18 bg-white">
        <div
          className="rounded-t-18 p-[20px] text-white"
          style={{ background: 'linear-gradient(180deg,#0d0d0d,#16240b)' }}
        >
          {loading && (
            <p className="text-13 text-battron-muted">Calculating score…</p>
          )}
          {error && <p className="text-13 text-battron-red">{error}</p>}
          {s && (
            <div className="flex items-center gap-[16px]">
              <GradeChip grade={s.grade} color={s.grade_color} />
              <div>
                <h3 className="m-0 text-14 tracking-[1px] text-battron-greenBright">
                  BATTRON SCORE
                </h3>
                <div className="my-[2px] text-30 font-black">{s.score} / 100</div>
                <div className="text-13" style={{ color: '#c9cdd2' }}>
                  {outcomeLine}
                </div>
              </div>
            </div>
          )}
        </div>

        {s && (
          <>
            <div className="grid grid-cols-2 gap-[10px] p-[16px]">
              <MetricCard label="State of Health" value={s.soh ? s.soh + ' %' : '—'} />
              <MetricCard
                label="Cell balance ΔV"
                value={s.dv != null ? s.dv + ' mV' : '—'}
              />
              <MetricCard label="Est. range" value={s.range} />
              <MetricCard label="Resale / 2nd-life value" value={s.resale} />
            </div>

            <FlagRow color={s.underwriting.flag}>
              {'Underwriting: ' + s.underwriting.text}
            </FlagRow>
            <FlagRow color={s.resale_flag.flag}>{s.resale_flag.text}</FlagRow>
          </>
        )}

        <div className="flex gap-[8px] px-[16px] pb-[18px]">
          <button
            type="button"
            className={`${BTN} bg-battron-readonlyBg text-battron-btnSText hover:bg-[#e2ebd2]`}
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className={`${BTN} bg-battron-black text-white hover:bg-battron-ink`}
            onClick={() => window.print()}
          >
            Print / PDF
          </button>
          <button
            type="button"
            disabled={!s}
            className={`${BTN} bg-battron-green text-battron-black hover:brightness-95 disabled:opacity-50`}
            onClick={whatsapp}
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
