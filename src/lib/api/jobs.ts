import { apiRequest } from './client'
import type { JobData as JobCard } from '../types'
import type {
  ApiScoreResult,
  CreateJobResponse,
  JobCardComputed,
  SaveJobResponse,
  ShareResponse,
} from './types'

export function createJob(
  partialFields?: Partial<JobCard['fields']>,
): Promise<CreateJobResponse> {
  return apiRequest<CreateJobResponse>('/jobs', {
    method: 'POST',
    body: { fields: partialFields ?? {} },
  })
}

export function getCurrentDraft(): Promise<JobCardComputed> {
  return apiRequest<JobCardComputed>('/jobs/current')
}

export function putCurrentDraft(job: JobCard): Promise<JobCardComputed> {
  return apiRequest<JobCardComputed>('/jobs/current', {
    method: 'PUT',
    body: job,
  })
}

export function deleteCurrentDraft(): Promise<void> {
  return apiRequest<void>('/jobs/current', { method: 'DELETE' })
}

export function getJob(jcno: string): Promise<JobCardComputed> {
  return apiRequest<JobCardComputed>(`/jobs/${encodeURIComponent(jcno)}`)
}

export function saveJob(jcno: string, job: JobCard): Promise<SaveJobResponse> {
  return apiRequest<SaveJobResponse>(`/jobs/${encodeURIComponent(jcno)}`, {
    method: 'PUT',
    body: job,
  })
}

export function deleteJob(jcno: string): Promise<void> {
  return apiRequest<void>(`/jobs/${encodeURIComponent(jcno)}`, {
    method: 'DELETE',
  })
}

export function previewScore(job: JobCard): Promise<ApiScoreResult> {
  return apiRequest<ApiScoreResult>('/jobs/score/preview', {
    method: 'POST',
    body: job,
  })
}

export function getJobScore(jcno: string): Promise<ApiScoreResult> {
  return apiRequest<ApiScoreResult>(
    `/jobs/${encodeURIComponent(jcno)}/score`,
  )
}

export function shareJob(jcno: string): Promise<ShareResponse> {
  return apiRequest<ShareResponse>(
    `/jobs/${encodeURIComponent(jcno)}/share/job`,
  )
}

export function shareScore(jcno: string): Promise<ShareResponse> {
  return apiRequest<ShareResponse>(
    `/jobs/${encodeURIComponent(jcno)}/share/score`,
  )
}
