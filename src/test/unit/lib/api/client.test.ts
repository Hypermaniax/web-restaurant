import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/lib/auth/auth-store'
import type { AuthSession, AuthUser } from '@/lib/auth/types'
import { apiHttpClient, apiRequest, refreshAccessToken } from '@/lib/api/client'

const originalAdapter = apiHttpClient.defaults.adapter

const user: AuthUser = {
  id: 'user-1',
  outletId: 'outlet-1',
  name: 'Admin Rembuk',
  email: 'admin@rembuk.local',
  role: 'ADMIN',
  isActive: true,
  lastLoginAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const refreshedSession: AuthSession = {
  accessToken: 'new-access-token',
  user,
}

function response<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200,
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: String(status),
    headers: {},
    config,
  }
}

function rejectWith(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): never {
  throw new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    config,
    null,
    response(config, data, status),
  )
}

describe('apiRequest', () => {
  afterEach(() => {
    apiHttpClient.defaults.adapter = originalAdapter
    useAuthStore.getState().clearSession()
    vi.restoreAllMocks()
  })

  it('refreshes the session using the httpOnly cookie', async () => {
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
      expect(config.url).toBe('/auth/refresh')
      expect(config.method).toBe('post')
      expect(config.withCredentials).toBe(true)
      return response(config, refreshedSession)
    })
    apiHttpClient.defaults.adapter = adapter

    const token = await refreshAccessToken()

    expect(token).toBe('new-access-token')
    expect(adapter).toHaveBeenCalledTimes(1)
    expect(useAuthStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'new-access-token',
      user,
    })
  })

  it('refreshes once and retries a request that returns 401', async () => {
    useAuthStore.getState().setSession({ accessToken: 'old-token', user })

    let rejectedRequests = 0
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
      if (config.url === '/auth/refresh') {
        return response(config, refreshedSession)
      }

      const authorization = String(config.headers.get('Authorization') ?? '')
      if (authorization === 'Bearer new-access-token') {
        return response(config, { ok: true })
      }

      rejectedRequests += 1
      rejectWith(config, 401, { message: 'Unauthorized' })
    })
    apiHttpClient.defaults.adapter = adapter

    const result = await apiRequest<{ ok: boolean }>('/admin/test')

    expect(result).toEqual({ ok: true })
    expect(rejectedRequests).toBe(1)
    expect(adapter).toHaveBeenCalledTimes(3)
    expect(useAuthStore.getState().accessToken).toBe('new-access-token')
  })

  it('sends JSON bodies as objects and attaches the access token', async () => {
    useAuthStore.getState().setSession({ accessToken: 'access-token', user })

    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
      expect(JSON.parse(String(config.data))).toEqual({ name: 'Kopi' })
      expect(config.headers.get('Authorization')).toBe('Bearer access-token')
      expect(config.headers.get('Content-Type')).toBe('application/json')
      return response(config, { id: 'item-1' })
    })
    apiHttpClient.defaults.adapter = adapter

    const result = await apiRequest<{ id: string }>('/admin/menu-items', {
      method: 'POST',
      body: JSON.stringify({ name: 'Kopi' }),
    })

    expect(result).toEqual({ id: 'item-1' })
  })

  it('maps API error payloads to ApiError', async () => {
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) =>
      rejectWith(config, 400, {
        message: ['Nama wajib diisi', 'Harga tidak valid'],
        requestId: 'req-1',
      }),
    )
    apiHttpClient.defaults.adapter = adapter

    await expect(
      apiRequest('/admin/categories', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Nama wajib diisi, Harga tidak valid',
      requestId: 'req-1',
    })
  })
})
