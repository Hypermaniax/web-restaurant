import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_SOCKET_URL: z.string().url(),
  VITE_APP_NAME: z.string().min(1).default('Rembuk'),
  VITE_ENABLE_PAYMENT_SIMULATOR: z.enum(['true', 'false']).default('false'),
})

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_ENABLE_PAYMENT_SIMULATOR: import.meta.env.VITE_ENABLE_PAYMENT_SIMULATOR,
})

function isLoopbackHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]'
  )
}

export function browserReachableUrl(
  rawUrl: string,
  pageHostname?: string,
): string {
  const url = new URL(rawUrl)
  if (
    pageHostname &&
    !isLoopbackHost(pageHostname) &&
    isLoopbackHost(url.hostname)
  ) {
    url.hostname = pageHostname
  }
  return url.toString().replace(/\/+$/, '')
}

const pageHostname =
  typeof window === 'undefined' ? undefined : window.location.hostname

export const API_BASE_URL = browserReachableUrl(
  env.VITE_API_BASE_URL,
  pageHostname,
)
export const SOCKET_URL = browserReachableUrl(env.VITE_SOCKET_URL, pageHostname)
export const ENABLE_PAYMENT_SIMULATOR =
  import.meta.env.DEV && env.VITE_ENABLE_PAYMENT_SIMULATOR === 'true'
