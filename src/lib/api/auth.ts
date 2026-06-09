import { apiRequest } from './client'
import type { AuthUser, LoginResponse, MeResponse } from './types'

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  })
}

export function register(
  name: string,
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/register', {
    method: 'POST',
    auth: false,
    body: { name, email, password },
  })
}

export function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' })
}

export function me(): Promise<MeResponse> {
  return apiRequest<MeResponse>('/auth/me')
}

export type { AuthUser }
