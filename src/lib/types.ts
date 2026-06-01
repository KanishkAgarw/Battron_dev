import type { FieldId } from './constants'

export type Fields = Record<FieldId, string>

export interface Part {
  b: string
  s: string
  q: string
  p: string
}

export interface JobData {
  fields: Fields
  complaints: string[]
  visual: string[]
  actions: string[]
  parts: Part[]
  /** per-cell voltage grids (string values, including empties) */
  cb: string[]
  ca: string[]
}

/** Shape persisted to localStorage (matches original collect()). */
export interface StoredJob extends JobData {}
