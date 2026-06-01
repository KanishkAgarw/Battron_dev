import { FIELDS, type FieldId } from './constants'
import type { Fields } from './types'

/** parseFloat; NaN -> null (matches original num()). */
export function num(v: string | number | null | undefined): number | null {
  const n = parseFloat(v as string)
  return isNaN(n) ? null : n
}

/** Local "YYYY-MM-DDTHH:MM" string (matches original localISO()). */
export function localISO(d?: Date): string {
  d = d || new Date()
  const l = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return l.toISOString().slice(0, 16)
}

/** Human date format (matches original fmt()). */
export function fmt(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
}

/** Job number generator (matches original genJob()). */
export function genJob(): string {
  return (
    'BTN-' +
    new Date().toISOString().slice(2, 10).replace(/-/g, '') +
    '-' +
    Math.floor(Math.random() * 900 + 100)
  )
}

/** ΔV (mV) from a per-cell grid; needs >1 numeric value (matches gridDelta()). */
export function gridDelta(arr: string[]): number | null {
  const vs = arr.map((v) => num(v)).filter((v): v is number => v != null)
  return vs.length > 1 ? Math.round((Math.max(...vs) - Math.min(...vs)) * 1000) : null
}

export function emptyFields(): Fields {
  const f = {} as Fields
  FIELDS.forEach((k: FieldId) => {
    f[k] = ''
  })
  return f
}

export interface RecalcResult {
  fields: Fields
  done: boolean
}

/**
 * Pure re-implementation of the original cellDelta() + calc().
 * Derived fields are "sticky" exactly where the original was (assigned only
 * when their inputs are present), and reset to '' exactly where it was.
 * `done` only ever flips to true (status -> "Done"), never back.
 */
export function recalc(
  fields: Fields,
  cb: string[],
  ca: string[],
  prevDone: boolean,
): RecalcResult {
  const f: Fields = { ...fields }
  let done = prevDone

  // --- cellDelta() ---
  const b = gridDelta(cb)
  const a = gridDelta(ca)
  if (b != null) f.dvbefore = String(b)
  if (a != null) f.dvafter = String(a)

  // --- calc() ---
  const rv = num(f.restv)
  const lv = num(f.loadv)
  f.sag = rv != null && lv != null ? (rv - lv).toFixed(2) + ' V' : ''

  const mn = num(f.mincellv)
  const mx = num(f.maxcellv)
  if (mn != null && mx != null) f.dvbms = String(Math.round((mx - mn) * 1000))

  const rated = num(f.ah)

  const ma = num(f.measah)
  const soh = ma != null && rated ? (ma / rated) * 100 : null
  f.soh = soh != null ? soh.toFixed(0) : ''
  f.sohbefore = soh != null ? soh.toFixed(0) : ''

  const fa = num(f.finah)
  const fsoh = fa != null && rated ? (fa / rated) * 100 : null
  f.sohafter = fsoh != null ? fsoh.toFixed(0) : ''

  if (soh != null && fsoh != null)
    f.sohgain = (fsoh - soh >= 0 ? '+' : '') + (fsoh - soh).toFixed(0) + ' %'
  else f.sohgain = ''

  const age = num(f.age)
  const ow = num(f.origwarr)
  if (age != null && ow != null)
    f.warrstatus = age <= ow ? `In warranty (${ow - age} mo left)` : 'Out of warranty'

  const v = num(f.volt)
  const useSoh = fsoh != null ? fsoh : soh
  const useAh = fa != null ? fa : ma || rated
  if (v && useAh && useSoh != null)
    f.finrange = Math.round((v * useAh * (useSoh / 100)) / 55) + ' km'

  // TAT
  const di = f.datein
  const doo = f.dateout
  if (di && doo) {
    const mins = Math.round((new Date(doo).getTime() - new Date(di).getTime()) / 60000)
    if (mins >= 0) {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      f.tat = (h ? h + 'h ' : '') + m + 'm'
      done = true
    }
  }

  return { fields: f, done }
}
