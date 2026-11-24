import { getErrorMessage as getUnknownErrorMessage } from '@/lib/errors'

const FALLBACK_MESSAGE = 'Terjadi kendala. Coba lagi sebentar lagi.'

export function getCustomerErrorMessage(error: unknown): string {
  return getUnknownErrorMessage(error, FALLBACK_MESSAGE)
}
