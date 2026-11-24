import { getErrorMessage as getUnknownErrorMessage } from '@/lib/errors'

const FALLBACK_MESSAGE = 'Terjadi kesalahan. Coba lagi.'

export function getErrorMessage(error: unknown): string {
  return getUnknownErrorMessage(error, FALLBACK_MESSAGE)
}
