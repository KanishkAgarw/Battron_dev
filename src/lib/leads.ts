import { scoreObj } from './score'
import { listJobs } from './storage'
import type { JobData } from './types'

export type LeadStatus = 'Draft' | 'Done'

export interface Lead {
  jcno: string
  customer: string
  mobile: string
  vehicle: string
  reg: string
  channel: string
  status: LeadStatus
  soh: string
  score: number
  grade: string
  gradeColor: string
  complaints: string
  dateIn: string
  technician: string
}

function jobStatus(job: JobData): LeadStatus {
  const di = job.fields.datein
  const doo = job.fields.dateout
  if (!di || !doo) return 'Draft'
  const mins = Math.round((new Date(doo).getTime() - new Date(di).getTime()) / 60000)
  return mins >= 0 ? 'Done' : 'Draft'
}

function formatDateIn(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function jobToLead(job: JobData): Lead {
  const f = job.fields
  const s = scoreObj(job)
  const soh = f.sohafter || f.soh || (s.soh ? String(s.soh) : '—')
  return {
    jcno: f.jcno || '—',
    customer: f.cust || '—',
    mobile: f.mobile || '—',
    vehicle: f.vmodel || '—',
    reg: f.vreg || '',
    channel: f.channel || '—',
    status: jobStatus(job),
    soh: soh ? `${soh}%` : '—',
    score: s.score,
    grade: s.grade,
    gradeColor: s.gcol,
    complaints: job.complaints.join(', ') || '—',
    dateIn: formatDateIn(f.datein),
    technician: f.tech || '—',
  }
}

/** Saved job cards exposed as CRM leads (newest first). */
export function listLeads(): Lead[] {
  return listJobs()
    .map(jobToLead)
    .sort((a, b) => b.jcno.localeCompare(a.jcno))
}
