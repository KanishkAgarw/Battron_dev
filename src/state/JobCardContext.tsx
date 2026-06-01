import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import {
  ACTIONS,
  CHANNEL_OPTIONS,
  COMPLAINTS,
  VISUAL,
  type FieldId,
} from '../lib/constants'
import { emptyFields, genJob, localISO, recalc } from '../lib/calc'
import {
  clearCurrent,
  loadCurrent,
  saveCurrent,
  saveJob as saveJobToStore,
} from '../lib/storage'
import { scoreObj, type ScoreResult } from '../lib/score'
import type { Fields, JobData, Part } from '../lib/types'

type ChipGroupKey = 'complaints' | 'visual' | 'actions'
type CellPhase = 'before' | 'after'

interface JobCardContextValue {
  data: JobData
  done: boolean
  cellPhase: CellPhase
  cellsGenerated: boolean
  jobNoTop: string
  setField: (id: FieldId, value: string) => void
  toggleChip: (group: ChipGroupKey, value: string) => void
  addPart: () => void
  updatePart: (index: number, key: keyof Part, value: string) => void
  setCell: (phase: CellPhase, index: number, value: string) => void
  setCellPhase: (phase: CellPhase) => void
  genCells: () => boolean
  saveJob: () => number
  newCard: () => boolean
  share: () => void
  getScore: () => ScoreResult
}

const JobCardContext = createContext<JobCardContextValue | null>(null)

const emptyPart = (): Part => ({ b: '', s: '', q: '', p: '' })

/** Selects default to their first <option> in the original HTML. */
const SELECT_DEFAULTS: Partial<Record<FieldId, string>> = {
  channel: CHANNEL_OPTIONS[0],
  financed: 'Unknown',
  chem: 'LFP',
  reachedfull: '—',
  subsystem: '—',
  rootcause: '—',
  outcome: '—',
}

function withSelectDefaults(fields: Fields): Fields {
  const f = { ...fields }
  ;(Object.keys(SELECT_DEFAULTS) as FieldId[]).forEach((k) => {
    if (!f[k]) f[k] = SELECT_DEFAULTS[k] as string
  })
  return f
}

function freshData(): JobData {
  return {
    fields: withSelectDefaults({ ...emptyFields(), jcno: genJob(), datein: localISO() }),
    complaints: [],
    visual: [],
    actions: [],
    parts: [emptyPart()],
    cb: [],
    ca: [],
  }
}

/** Bring a stored object up to a complete JobData (matches original apply()). */
function normalize(saved: JobData): JobData {
  const fields = withSelectDefaults({ ...emptyFields(), ...(saved.fields || {}) })
  const parts = saved.parts && saved.parts.length ? saved.parts : [emptyPart()]
  return {
    fields,
    complaints: saved.complaints || [],
    visual: saved.visual || [],
    actions: saved.actions || [],
    parts,
    cb: saved.cb || [],
    ca: saved.ca || [],
  }
}

/** Storage projection: drop fully-empty part rows (matches original getParts()). */
function toStored(data: JobData): JobData {
  return {
    ...data,
    parts: data.parts.filter((p) => p.b || p.s || p.q || p.p),
  }
}

interface CoreState {
  data: JobData
  done: boolean
}

function init(): CoreState {
  const saved = loadCurrent()
  const base =
    saved && saved.fields && saved.fields.jcno ? normalize(saved) : freshData()
  const { fields, done } = recalc(base.fields, base.cb, base.ca, false)
  return { data: { ...base, fields }, done }
}

const SOURCE: Record<ChipGroupKey, string[]> = {
  complaints: COMPLAINTS,
  visual: VISUAL,
  actions: ACTIONS,
}

export function JobCardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CoreState>(init)
  const [cellPhase, setCellPhase] = useState<CellPhase>('before')
  const timer = useRef<number | undefined>(undefined)

  const persist = (data: JobData) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      saveCurrent(toStored(data))
    }, 250)
  }

  const mutate = (fn: (d: JobData) => JobData) => {
    setState((prev) => {
      const nextData = fn(prev.data)
      const { fields, done } = recalc(
        nextData.fields,
        nextData.cb,
        nextData.ca,
        prev.done,
      )
      const data: JobData = { ...nextData, fields }
      persist(data)
      return { data, done }
    })
  }

  const setField = (id: FieldId, value: string) =>
    mutate((d) => ({ ...d, fields: { ...d.fields, [id]: value } }))

  const toggleChip = (group: ChipGroupKey, value: string) =>
    mutate((d) => {
      const set = new Set(d[group])
      if (set.has(value)) set.delete(value)
      else set.add(value)
      return { ...d, [group]: SOURCE[group].filter((x) => set.has(x)) }
    })

  const addPart = () => mutate((d) => ({ ...d, parts: [...d.parts, emptyPart()] }))

  const updatePart = (index: number, key: keyof Part, value: string) =>
    mutate((d) => ({
      ...d,
      parts: d.parts.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    }))

  const setCell = (phase: CellPhase, index: number, value: string) =>
    mutate((d) => {
      const key = phase === 'before' ? 'cb' : 'ca'
      const arr = [...d[key]]
      arr[index] = value
      return { ...d, [key]: arr }
    })

  const genCells = (): boolean => {
    const n = parseInt(state.data.fields.cellqty, 10) || 0
    if (n < 1 || n > 64) return false
    mutate((d) => ({
      ...d,
      cb: Array(n).fill(''),
      ca: Array(n).fill(''),
    }))
    setCellPhase('before')
    return true
  }

  const saveJob = (): number => saveJobToStore(toStored(state.data))

  const newCard = (): boolean => {
    if (!window.confirm('Start a new blank job card? Current one is auto-saved.'))
      return false
    clearCurrent()
    const fresh = freshData()
    const { fields, done } = recalc(fresh.fields, fresh.cb, fresh.ca, false)
    setState({ data: { ...fresh, fields }, done })
    setCellPhase('before')
    persist({ ...fresh, fields })
    return true
  }

  const share = () => {
    const o = state.data
    const f = o.fields
    const t =
      'Battron Job Card ' +
      f.jcno +
      '\nCustomer: ' +
      (f.cust || '-') +
      ' (' +
      (f.mobile || '-') +
      ')' +
      '\nVehicle: ' +
      (f.vmodel || '-') +
      ' ' +
      (f.vreg || '') +
      '\nComplaint: ' +
      (o.complaints.join(', ') || '-') +
      '\nSoH: ' +
      (f.sohafter || f.soh || '-') +
      '%' +
      '\nVerdict: ' +
      (f.verdict || '-')
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank')
  }

  const getScore = () => scoreObj(state.data)

  const cellsGenerated = state.data.cb.length > 0 || state.data.ca.length > 0
  const jobNoTop = (state.data.fields.jcno || 'JOB —').slice(0, 16)

  const value: JobCardContextValue = {
    data: state.data,
    done: state.done,
    cellPhase,
    cellsGenerated,
    jobNoTop,
    setField,
    toggleChip,
    addPart,
    updatePart,
    setCell,
    setCellPhase,
    genCells,
    saveJob,
    newCard,
    share,
    getScore,
  }

  return <JobCardContext.Provider value={value}>{children}</JobCardContext.Provider>
}

export function useJobCard(): JobCardContextValue {
  const ctx = useContext(JobCardContext)
  if (!ctx) throw new Error('useJobCard must be used within JobCardProvider')
  return ctx
}
