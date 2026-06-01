import { num } from './calc'
import { VIS_SAFETY } from './constants'
import type { JobData } from './types'

export type Grade = 'A' | 'B' | 'C' | 'D'
export type FlagColor = 'ok' | 'warn' | 'bad'

export interface ScoreResult {
  soh: number
  dv: number | null
  score: number
  grade: Grade
  gcol: string
  resale: string
  fit: boolean
  safety: boolean
  range: string
  under: { t: string; c: FlagColor }
}

/** bestDV(): dvafter || dvbms || dvbefore (matches original). */
function bestDV(f: JobData['fields']): number | null {
  return num(f.dvafter) || num(f.dvbms) || num(f.dvbefore)
}

/** Pure re-implementation of the original scoreObj(). */
export function scoreObj(data: JobData): ScoreResult {
  const f = data.fields
  const soh = num(f.sohafter) || num(f.soh) || num(f.bmssoh) || 0
  const dv = bestDV(f)
  const bal =
    dv == null ? 70 : dv < 30 ? 100 : dv < 60 ? 82 : dv < 100 ? 62 : dv < 200 ? 38 : 15

  const rc = f.rootcause
  const oc = f.outcome
  let fault = 100
  if (oc === 'Beyond economic repair' || oc === 'Warranty rejected') fault = 10
  else if (['Water ingress', 'Thermal'].indexOf(rc) >= 0) fault = 25
  else if (rc === 'Dead / shorted cell') fault = 55
  else if (rc === 'BMS fault') fault = 68
  else if (
    ['Cell imbalance', 'Connector / Wiring', 'Mechanical', 'Charger / Usage'].indexOf(
      rc,
    ) >= 0
  )
    fault = 80
  else if (rc === 'Cell degradation') fault = 72

  const safety = data.visual.some((c) => VIS_SAFETY.indexOf(c) >= 0)

  let score = Math.round(0.62 * soh + 0.22 * bal + 0.16 * fault)
  if (safety) score = Math.min(score, 55)
  score = Math.max(0, Math.min(100, score))

  const grade: Grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D'
  const gcol =
    grade === 'A'
      ? '#a4ce3a'
      : grade === 'B'
        ? '#cfe35a'
        : grade === 'C'
          ? '#e6b73c'
          : '#d9603a'

  const rp = grade === 'A' ? 0.6 : grade === 'B' ? 0.45 : grade === 'C' ? 0.25 : 0.05
  const price = num(f.newprice)
  const resale = price
    ? '₹ ' + Math.round(price * rp).toLocaleString('en-IN')
    : Math.round(rp * 100) + '% of new'

  const fit = (grade === 'A' || grade === 'B') && !safety
  const under: { t: string; c: FlagColor } =
    grade === 'A' || grade === 'B'
      ? { t: 'Healthy collateral — low default risk', c: 'ok' }
      : grade === 'C'
        ? { t: 'Monitor — moderate risk', c: 'warn' }
        : { t: 'At risk — weak collateral', c: 'bad' }

  return {
    soh,
    dv,
    score,
    grade,
    gcol,
    resale,
    fit,
    safety,
    range: f.finrange || '—',
    under,
  }
}
