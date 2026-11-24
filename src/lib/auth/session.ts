import { apiRequest, refreshAccessToken } from '@/lib/api/client'
import { useAuthStore } from './auth-store'
import type { AuthSession, UserRole } from './types'

export async function login(
  email: string,
  password: string,
): Promise<AuthSession> {
  const session = await apiRequest<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  })

  useAuthStore.getState().setSession(session)
  return session
}

export async function bootstrapSession(): Promise<AuthSession | null> {
  useAuthStore.getState().setStatus('loading')
  const accessToken = await refreshAccessToken()

  if (!accessToken) {
    return null
  }

  const user = useAuthStore.getState().user
  if (!user) {
    useAuthStore.getState().clearSession()
    return null
  }

  return { accessToken, user }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  } finally {
    useAuthStore.getState().clearSession()
  }
}

export function canAccessAdmin(role: UserRole | undefined): boolean {
  return role === 'ADMIN' || role === 'CASHIER'
}
