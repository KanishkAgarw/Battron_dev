import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ACTIONS,
  CHANNEL_OPTIONS,
  CHEM_OPTIONS,
  COMPLAINTS,
  FINANCED_OPTIONS,
  OUTCOME_OPTIONS,
  REACHED_FULL_OPTIONS,
  ROOTCAUSE_OPTIONS,
  SUBSYSTEM_OPTIONS,
  VISUAL,
  VIS_SAFETY,
} from '../lib/constants'
import { fetchMetaOptions } from '../lib/api/meta'
import type { MetaOptions } from '../lib/api/types'

export interface MetaValue extends MetaOptions {}

const FALLBACK: MetaOptions = {
  complaints: [...COMPLAINTS],
  visual: [...VISUAL],
  visual_safety: [...VIS_SAFETY],
  actions: [...ACTIONS],
  channel: [...CHANNEL_OPTIONS],
  financed: [...FINANCED_OPTIONS],
  chemistry: [...CHEM_OPTIONS],
  reached_full: [...REACHED_FULL_OPTIONS],
  subsystem: [...SUBSYSTEM_OPTIONS],
  root_cause: [...ROOTCAUSE_OPTIONS],
  outcome: [...OUTCOME_OPTIONS],
}

const MetaContext = createContext<MetaOptions>(FALLBACK)

export function MetaProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<MetaOptions>(FALLBACK)

  useEffect(() => {
    fetchMetaOptions()
      .then(setMeta)
      .catch(() => setMeta(FALLBACK))
  }, [])

  const value = useMemo(() => meta, [meta])

  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>
}

export function useMeta(): MetaOptions {
  return useContext(MetaContext)
}
