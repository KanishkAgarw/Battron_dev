import type { JobData } from '../types'

export type UserRole = 'admin' | 'technician'

export interface AuthUser {
  email: string
  name: string
  role: UserRole
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: AuthUser
}

export interface MeResponse extends AuthUser {
  logged_in_at: string
}

export interface ApiErrorBody {
  detail: string | unknown[]
  code: string | null
}

export class ApiError extends Error {
  status: number
  code: string | null
  detail: string

  constructor(status: number, body: ApiErrorBody) {
    const detail =
      typeof body.detail === 'string'
        ? body.detail
        : Array.isArray(body.detail)
          ? 'Validation failed'
          : 'Request failed'
    super(detail)
    this.status = status
    this.code = body.code
    this.detail = detail
  }
}

export interface MetaOptions {
  complaints: string[]
  visual: string[]
  visual_safety: string[]
  actions: string[]
  channel: string[]
  financed: string[]
  chemistry: string[]
  reached_full: string[]
  subsystem: string[]
  root_cause: string[]
  outcome: string[]
}

export interface JobCardComputed {
  job: JobData
  status: 'Draft' | 'Done'
  done: boolean
}

export interface CreateJobResponse {
  job: JobData
  status: 'Draft' | 'Done'
  done: boolean
}

export interface SaveJobResponse {
  job: JobCardComputed
  total_saved: number | null
}

export type FlagColor = 'ok' | 'warn' | 'bad'

export interface ScoreFlag {
  text: string
  flag: FlagColor
}

export interface ApiScoreResult {
  soh: number
  dv: number | null
  score: number
  grade: string
  grade_color: string
  resale: string
  fit_for_resale: boolean
  safety: boolean
  range: string
  underwriting: ScoreFlag
  resale_flag: ScoreFlag
  outcome_line: string
}

export interface Lead {
  jcno: string
  customer: string
  mobile: string
  vehicle: string
  reg: string
  channel: string
  status: 'Draft' | 'Done'
  soh: string
  score: number
  grade: string
  grade_color: string
  complaints: string
  date_in: string
  technician: string
}

export interface LeadListStats {
  total: number
  done: number
  draft: number
}

export interface LeadsResponse {
  items: Lead[]
  stats: LeadListStats
}

export interface JobListResponse extends LeadsResponse {
  total: number
  page: number
  page_size: number
}

export interface ShareResponse {
  whatsapp_url: string
  text: string
}
