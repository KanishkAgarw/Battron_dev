import { apiRequest } from './client'
import type { JobListResponse, LeadsResponse } from './types'

export function listLeads(params?: {
  search?: string
  status?: 'Draft' | 'Done'
}): Promise<LeadsResponse> {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.status) q.set('status', params.status)
  const qs = q.toString()
  return apiRequest<LeadsResponse>(`/leads${qs ? `?${qs}` : ''}`)
}

export function listJobs(params?: {
  search?: string
  status?: 'Draft' | 'Done'
  page?: number
  page_size?: number
}): Promise<JobListResponse> {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.status) q.set('status', params.status)
  if (params?.page) q.set('page', String(params.page))
  if (params?.page_size) q.set('page_size', String(params.page_size))
  const qs = q.toString()
  return apiRequest<JobListResponse>(`/jobs${qs ? `?${qs}` : ''}`)
}
