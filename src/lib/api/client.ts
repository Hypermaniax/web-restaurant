import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/lib/env'
import { useAuthStore } from '@/lib/auth/auth-store'
import type { AuthSession } from '@/lib/auth/types'

interface ApiErrorPayload {
  statusCode?: number
  error?: string
  message?: string | string[]
  requestId?: string
  path?: string
  timestamp?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly details: unknown
  readonly requestId?: string

  constructor(
    message: string,
    status: number,
    details?: unknown,
    requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    this.requestId = requestId
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: HeadersInit
  skipAuth?: boolean
  retryAuth?: boolean
  responseType?: AxiosRequestConfig['responseType']
}

export const apiHttpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

let refreshPromise: Promise<string | null> | null = null

function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {}
  headers.forEach((value, key) => {
    record[key] = value
  })
  return record
}

function normalizeRequestBody(
  body: BodyInit | null | undefined,
  headers: Headers,
): unknown {
  if (typeof body !== 'string') {
    return body ?? undefined
  }

  if (headers.get('Content-Type') !== 'application/json') {
    return body
  }

  try {
    return JSON.parse(body) as unknown
  } catch {
    return body
  }
}

function errorPayload(error: AxiosError): ApiErrorPayload | null {
  const payload = error.response?.data
  if (!payload || typeof payload !== 'object' || payload instanceof Blob) {
    return null
  }
  return payload as ApiErrorPayload
}

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0
  const payload = errorPayload(error)
  const message = Array.isArray(payload?.message)
    ? payload.message.join(', ')
    : (payload?.message ??
      (status === 0
        ? 'Tidak dapat terhubung ke server.'
        : `Request gagal (${status})`))

  return new ApiError(
    message,
    status,
    payload ?? error.response?.data,
    payload?.requestId,
  )
}

async function requestRefresh(): Promise<string | null> {
  try {
    const response = await apiHttpClient.post<AuthSession>('/auth/refresh', {})
    useAuthStore.getState().setSession(response.data)
    return response.data.accessToken
  } catch {
    useAuthStore.getState().clearSession()
    return null
  }
}

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = requestRefresh().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    skipAuth = false,
    retryAuth = true,
    headers: rawHeaders,
    body,
    responseType,
    method = 'GET',
    signal,
  } = options
  const headers = new Headers(rawHeaders)
  const token = useAuthStore.getState().accessToken

  if (!skipAuth && token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    const response = await apiHttpClient.request<T>({
      url: path,
      method: method as AxiosRequestConfig['method'],
      headers: headersToRecord(headers),
      data: normalizeRequestBody(body, headers),
      responseType,
      signal: signal ?? undefined,
    })

    if (response.status === 204) {
      return undefined as T
    }

    return response.data
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error
    }

    if (error.response?.status === 401 && !skipAuth && retryAuth) {
      const refreshedToken = await refreshAccessToken()
      if (refreshedToken) {
        return apiRequest<T>(path, {
          ...options,
          retryAuth: false,
        })
      }
    }

    throw toApiError(error)
  }
}
