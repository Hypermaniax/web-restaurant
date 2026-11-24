import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiHttpClient } from '@/lib/api/client'
import { customerApi } from '@/features/customer/api/customer-api'

const originalAdapter = apiHttpClient.defaults.adapter

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

describe('customer order API', () => {
  afterEach(() => {
    apiHttpClient.defaults.adapter = originalAdapter
    vi.restoreAllMocks()
  })

  it('sends the idempotency key and table code when creating an order', async () => {
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) =>
      response(config, { id: 'order-1' }, 201),
    )
    apiHttpClient.defaults.adapter = adapter

    await customerApi.createOrder(
      'T01',
      [
        {
          menuItemId: 'menu-1',
          qty: 1,
          modifierOptionIds: ['pedas'],
        },
      ],
      { idempotencyKey: 'idem-123', customerName: 'Budi' },
    )

    expect(adapter).toHaveBeenCalledTimes(1)
    const config = adapter.mock.calls[0][0]
    const body = JSON.parse(String(config.data)) as Record<string, unknown>

    expect(config.url).toBe('/public/orders')
    expect(config.method).toBe('post')
    expect(config.headers.get('Idempotency-Key')).toBe('idem-123')
    expect(body).toEqual(
      expect.objectContaining({
        tableCode: 'T01',
        customerName: 'Budi',
        notes: null,
      }),
    )
  })

  it('sends a table code when simulating payment', async () => {
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) =>
      response(config, {
        status: 'PENDING',
        message: 'Simulasi pembayaran dikirim ke Xendit',
      }),
    )
    apiHttpClient.defaults.adapter = adapter

    await customerApi.simulatePayment('T01', 'order-1')

    const config = adapter.mock.calls[0][0]
    expect(config.url).toBe('/public/orders/order-1/simulate-payment')
    expect(config.method).toBe('post')
    expect(JSON.parse(String(config.data))).toEqual({ tableCode: 'T01' })
  })
})
