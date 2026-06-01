import type { JobData } from './types'

const CURRENT_KEY = 'btn_current'
const JOBS_KEY = 'btn_jobs'

export function loadCurrent(): JobData | null {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveCurrent(data: JobData): void {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(data))
  } catch {
    /* ignore quota errors, matches original */
  }
}

export function clearCurrent(): void {
  localStorage.removeItem(CURRENT_KEY)
}

export function listJobs(): JobData[] {
  try {
    return JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')
  } catch {
    return []
  }
}

/** Upsert by jcno (matches original saveJob()). Returns new total count. */
export function saveJob(data: JobData): number {
  const jobs = listJobs()
  const i = jobs.findIndex((j) => j.fields?.jcno === data.fields.jcno)
  if (i >= 0) jobs[i] = data
  else jobs.push(data)
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
  } catch {
    /* ignore */
  }
  return jobs.length
}
