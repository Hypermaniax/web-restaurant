import { describe, expect, it } from 'vitest'
import { getErrorMessage as getAdminErrorMessage } from '@/features/admin/lib/errors'
import { getCustomerErrorMessage } from '@/features/customer/lib/errors'
import { ApiError } from '@/lib/api/client'
import { getErrorMessage } from '@/lib/errors'

describe('getErrorMessage', () => {
  it('returns the API error message', () => {
    const error = new ApiError('Meja tidak ditemukan', 404)

    expect(getErrorMessage(error, 'fallback')).toBe('Meja tidak ditemukan')
  })

  it('returns a regular error message', () => {
    expect(getErrorMessage(new Error('Gagal memuat'), 'fallback')).toBe(
      'Gagal memuat',
    )
  })

  it('returns the fallback for unknown errors', () => {
    expect(getErrorMessage({}, 'fallback')).toBe('fallback')
  })
})

describe('feature error messages', () => {
  it('keeps the admin fallback message', () => {
    expect(getAdminErrorMessage({})).toBe('Terjadi kesalahan. Coba lagi.')
  })

  it('keeps the customer fallback message', () => {
    expect(getCustomerErrorMessage({})).toBe(
      'Terjadi kendala. Coba lagi sebentar lagi.',
    )
  })
})
