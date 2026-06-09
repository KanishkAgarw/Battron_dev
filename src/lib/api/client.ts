import { clearAuthSession, getToken } from './token'
import type { ApiErrorBody } from './types'
import { ApiError } from './types'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

export function getApiBaseUrl(): string {
  return BASE_URL
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers: extraHeaders, ...init } = options

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(extraHeaders as Record<string, string>),
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  let json: ApiErrorBody | T | null = null
  if (text) {
    try {
      json = JSON.parse(text) as ApiErrorBody | T
    } catch {
      json = null
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthSession()
      unauthorizedHandler?.()
    }
    const errBody: ApiErrorBody =
      json && typeof json === 'object' && 'detail' in json
        ? (json as ApiErrorBody)
        : { detail: res.statusText, code: null }
    throw new ApiError(res.status, errBody)
  }

  return json as T
}
