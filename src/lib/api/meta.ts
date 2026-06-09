import { apiRequest } from './client'
import type { MetaOptions } from './types'

export function fetchMetaOptions(): Promise<MetaOptions> {
  return apiRequest<MetaOptions>('/meta/options', { auth: false })
}
