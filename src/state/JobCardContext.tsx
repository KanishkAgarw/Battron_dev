import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ApiError } from '../lib/api'
import * as jobsApi from '../lib/api/jobs'
import type { ApiScoreResult, JobCardComputed, MetaOptions } from '../lib/api/types'
import { emptyFields } from '../lib/calc'
import {
  CHANNEL_OPTIONS,
  type FieldId,
} from '../lib/constants'
import { useMeta } from './MetaContext'
import type { Fields, JobData, Part } from '../lib/types'

type ChipGroupKey = 'complaints' | 'visual' | 'actions'
type CellPhase = 'before' | 'after'

interface JobCardContextValue {
  data: JobData
  done: boolean
  loading: boolean
  saving: boolean
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
  saveJob: () => Promise<number>
  loadSavedJob: (jcno: string) => Promise<boolean>
  newCard: () => Promise<boolean>
  share: () => Promise<void>
  fetchScorePreview: () => Promise<ApiScoreResult>
}

const JobCardContext = createContext<JobCardContextValue | null>(null)

const emptyPart = (): Part => ({ b: '', s: '', q: '', p: '' })

const SELECT_DEFAULTS: Partial<Record<FieldId, string>> = {
  channel: CHANNEL_OPTIONS[0],
  financed: 'Unknown',
  chem: 'LFP',
  reachedfull: '—',
  subsystem: '—',
  rootcause: '—',
  outcome: '—',
}

function withSelectDefaults(fields: Fields, meta: MetaOptions): Fields {
  const f = { ...emptyFields(), ...fields }
  const defaults: Partial<Record<FieldId, string>> = {
    ...SELECT_DEFAULTS,
    channel: meta.channel[0] ?? SELECT_DEFAULTS.channel,
    financed: meta.financed[0] ?? SELECT_DEFAULTS.financed,
    chem: meta.chemistry[0] ?? SELECT_DEFAULTS.chem,
    reachedfull: meta.reached_full[0] ?? SELECT_DEFAULTS.reachedfull,
    subsystem: meta.subsystem[0] ?? SELECT_DEFAULTS.subsystem,
    rootcause: meta.root_cause[0] ?? SELECT_DEFAULTS.rootcause,
    outcome: meta.outcome[0] ?? SELECT_DEFAULTS.outcome,
  }
  ;(Object.keys(defaults) as FieldId[]).forEach((k) => {
    if (!f[k]) f[k] = defaults[k] as string
  })
  return f
}

function normalize(job: JobData, meta: MetaOptions): JobData {
  const fields = withSelectDefaults(job.fields || emptyFields(), meta)
  const parts = job.parts?.length ? job.parts : [emptyPart()]
  return {
    fields,
    complaints: job.complaints || [],
    visual: job.visual || [],
    actions: job.actions || [],
    parts,
    cb: job.cb || [],
    ca: job.ca || [],
  }
}

function toStored(data: JobData): JobData {
  return {
    ...data,
    parts: data.parts.filter((p) => p.b || p.s || p.q || p.p),
  }
}

function applyComputed(
  computed: JobCardComputed,
  meta: MetaOptions,
): { data: JobData; done: boolean } {
  return {
    data: normalize(computed.job, meta),
    done: computed.done,
  }
}

interface JobCardProviderProps {
  children: ReactNode
  initialJcno?: string | null
  /** When true: DELETE /jobs/current then POST /jobs (dashboard “New job card”). */
  forceNew?: boolean
}

export function JobCardProvider({
  children,
  initialJcno,
  forceNew = false,
}: JobCardProviderProps) {
  const meta = useMeta()
  const [data, setData] = useState<JobData>(() =>
    normalize(
      {
        fields: emptyFields(),
        complaints: [],
        visual: [],
        actions: [],
        parts: [emptyPart()],
        cb: [],
        ca: [],
      },
      meta,
    ),
  )
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cellPhase, setCellPhase] = useState<CellPhase>('before')
  const timer = useRef<number | undefined>(undefined)
  const dataRef = useRef(data)
  dataRef.current = data

  const chipSource: Record<ChipGroupKey, string[]> = {
    complaints: meta.complaints,
    visual: meta.visual,
    actions: meta.actions,
  }

  const persist = useCallback(
    (payload: JobData) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(async () => {
        setSaving(true)
        try {
          const computed = await jobsApi.putCurrentDraft(toStored(payload))
          const next = applyComputed(computed, meta)
          setData(next.data)
          setDone(next.done)
        } catch (err) {
          if (err instanceof ApiError && err.code === 'NO_DRAFT') {
            try {
              await jobsApi.createJob()
              const computed = await jobsApi.putCurrentDraft(toStored(payload))
              const next = applyComputed(computed, meta)
              setData(next.data)
              setDone(next.done)
            } catch {
              /* ignore */
            }
          }
        } finally {
          setSaving(false)
        }
      }, 250)
    },
    [meta],
  )

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      try {
        if (forceNew) {
          try {
            await jobsApi.deleteCurrentDraft()
          } catch {
            /* no draft */
          }
          const created = await jobsApi.createJob()
          if (!cancelled) {
            const next = applyComputed(
              {
                job: created.job,
                status: created.status as 'Draft' | 'Done',
                done: created.done,
              },
              meta,
            )
            setData(next.data)
            setDone(next.done)
          }
        } else if (initialJcno) {
          const computed = await jobsApi.getJob(initialJcno)
          if (!cancelled) {
            const next = applyComputed(computed, meta)
            setData(next.data)
            setDone(next.done)
          }
        } else {
          try {
            const computed = await jobsApi.getCurrentDraft()
            if (!cancelled) {
              const next = applyComputed(computed, meta)
              setData(next.data)
              setDone(next.done)
            }
          } catch (err) {
            if (err instanceof ApiError && err.code === 'NO_DRAFT') {
              const created = await jobsApi.createJob()
              if (!cancelled) {
                const next = applyComputed(
                  {
                    job: created.job,
                    status: created.status as 'Draft' | 'Done',
                    done: created.done,
                  },
                  meta,
                )
                setData(next.data)
                setDone(next.done)
              }
            } else {
              throw err
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
      window.clearTimeout(timer.current)
    }
  }, [initialJcno, forceNew, meta])

  const mutate = useCallback(
    (fn: (d: JobData) => JobData) => {
      setData((prev) => {
        const nextData = normalize(fn(prev), meta)
        persist(nextData)
        return nextData
      })
    },
    [meta, persist],
  )

  const setField = useCallback(
    (id: FieldId, value: string) =>
      mutate((d) => ({ ...d, fields: { ...d.fields, [id]: value } })),
    [mutate],
  )

  const toggleChip = useCallback(
    (group: ChipGroupKey, value: string) =>
      mutate((d) => {
        const set = new Set(d[group])
        if (set.has(value)) set.delete(value)
        else set.add(value)
        return {
          ...d,
          [group]: chipSource[group].filter((x) => set.has(x)),
        }
      }),
    [mutate, chipSource],
  )

  const addPart = useCallback(
    () => mutate((d) => ({ ...d, parts: [...d.parts, emptyPart()] })),
    [mutate],
  )

  const updatePart = useCallback(
    (index: number, key: keyof Part, value: string) =>
      mutate((d) => ({
        ...d,
        parts: d.parts.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
      })),
    [mutate],
  )

  const setCell = useCallback(
    (phase: CellPhase, index: number, value: string) =>
      mutate((d) => {
        const key = phase === 'before' ? 'cb' : 'ca'
        const arr = [...d[key]]
        arr[index] = value
        return { ...d, [key]: arr }
      }),
    [mutate],
  )

  const genCells = useCallback((): boolean => {
    const n = parseInt(dataRef.current.fields.cellqty, 10) || 0
    if (n < 1 || n > 64) return false
    mutate((d) => ({
      ...d,
      cb: Array(n).fill(''),
      ca: Array(n).fill(''),
    }))
    setCellPhase('before')
    return true
  }, [mutate])

  const saveJob = useCallback(async (): Promise<number> => {
    const stored = toStored(dataRef.current)
    const jcno = stored.fields.jcno
    const res = await jobsApi.saveJob(jcno, stored)
    const next = applyComputed(res.job, meta)
    setData(next.data)
    setDone(next.done)
    return res.total_saved ?? 0
  }, [meta])

  const loadSavedJob = useCallback(
    async (jcno: string): Promise<boolean> => {
      try {
        const computed = await jobsApi.getJob(jcno)
        const next = applyComputed(computed, meta)
        setData(next.data)
        setDone(next.done)
        setCellPhase('before')
        await jobsApi.putCurrentDraft(toStored(next.data))
        return true
      } catch {
        return false
      }
    },
    [meta],
  )

  const newCard = useCallback(async (): Promise<boolean> => {
    if (
      !window.confirm(
        'Start a new blank job card? Current one is auto-saved.',
      )
    )
      return false
    window.clearTimeout(timer.current)
    await jobsApi.deleteCurrentDraft()
    const created = await jobsApi.createJob()
    const next = applyComputed(
      {
        job: created.job,
        status: created.status as 'Draft' | 'Done',
        done: created.done,
      },
      meta,
    )
    setData(next.data)
    setDone(next.done)
    setCellPhase('before')
    return true
  }, [meta])

  const share = useCallback(async (): Promise<void> => {
    const jcno = dataRef.current.fields.jcno
    const res = await jobsApi.shareJob(jcno)
    window.open(res.whatsapp_url, '_blank')
  }, [])

  const fetchScorePreview = useCallback(async (): Promise<ApiScoreResult> => {
    return jobsApi.previewScore(toStored(dataRef.current))
  }, [])

  const cellsGenerated = data.cb.length > 0 || data.ca.length > 0
  const jobNoTop = (data.fields.jcno || 'JOB —').slice(0, 16)

  const value: JobCardContextValue = {
    data,
    done,
    loading,
    saving,
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
    loadSavedJob,
    newCard,
    share,
    fetchScorePreview,
  }

  return (
    <JobCardContext.Provider value={value}>{children}</JobCardContext.Provider>
  )
}

export function useJobCard(): JobCardContextValue {
  const ctx = useContext(JobCardContext)
  if (!ctx) throw new Error('useJobCard must be used within JobCardProvider')
  return ctx
}
