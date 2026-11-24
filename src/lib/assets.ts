import { API_BASE_URL } from '@/lib/env'

export function assetUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
    return value
  }

  return `${API_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`
}
