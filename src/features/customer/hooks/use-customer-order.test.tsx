import { act, renderHook, waitFor } from '@testing-library/react'
import { customerApi, usePaymentStatus } from '../api/customer-api'
import type { CreatedOrder, QuoteTotals } from '../api/types'
import { useCustomerOrder } from './use-customer-order'

vi.mock('../api/customer-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/customer-api')>()
  return {
    ...actual,
    usePaymentStatus: vi.fn(),
  }
})

const quote: QuoteTotals = {
  subtotal: 28000,
  discountAmount: 0,
  serviceAmount: 1400,
  taxAmount: 2940,
  total: 32340,
  taxInclusive: false,
  taxBaseIncludesService: true,
  taxRateBp: 1000,
  serviceRateBp: 500,
}

const order: CreatedOrder = {
  ...quote,
  id: 'order-1',
  orderNumber: 'RMB-001',
  orderType: 'DINE_IN',
  status: 'PENDING_PAYMENT',
  paymentStatus: 'PENDING',
  table: { id: 'table-1', code: 'M01', name: 'Meja 01' },
  queueNumber: null,
  queueDisplay: null,
  customerName: 'Budi',
  notes: null,
  expiresAt: '2026-11-22T00:30:00.000Z',
  createdAt: '2026-11-22T00:00:00.000Z',
}

const quoteItems = [{ menuItemId: 'nasi', qty: 1 }]

describe('useCustomerOrder', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    vi.mocked(usePaymentStatus).mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('creates a cash order and moves to payment', async () => {
    const createOrder = vi
      .spyOn(customerApi, 'createOrder')
      .mockResolvedValue(order)
    const { result } = renderHook(() =>
      useCustomerOrder({ tableCode: 'M01', quote, quoteItems }),
    )

    await act(async () => {
      await result.current.submitCheckout({
        customerName: 'Budi',
        notes: '',
        paymentMethod: 'CASH',
      })
    })

    expect(createOrder).toHaveBeenCalledWith(
      'M01',
      quoteItems,
      expect.objectContaining({
        customerName: 'Budi',
        notes: null,
        idempotencyKey: expect.any(String),
      }),
    )
    expect(result.current.stage).toBe('payment')
    expect(result.current.activeOrder).toEqual(order)
    expect(result.current.paymentMethod).toBe('CASH')
  })

  it('requests a QRIS payment and stores the payment', async () => {
    const qris = {
      paymentId: 'pay-1',
      referenceId: 'ref-1',
      status: 'PENDING',
      amount: 32340,
      qrString: 'qr-string',
      expiresAt: '2026-11-22T00:30:00.000Z',
    }
    vi.spyOn(customerApi, 'createOrder').mockResolvedValue(order)
    const payOnline = vi.spyOn(customerApi, 'payOnline').mockResolvedValue(qris)
    const { result } = renderHook(() =>
      useCustomerOrder({ tableCode: 'M01', quote, quoteItems }),
    )

    await act(async () => {
      await result.current.submitCheckout({
        customerName: '',
        notes: '',
        paymentMethod: 'QRIS',
      })
    })

    await waitFor(() => {
      expect(payOnline).toHaveBeenCalledWith('M01', order.id)
    })
    expect(result.current.paymentMethod).toBe('QRIS')
    expect(result.current.qris).toEqual(qris)
  })

  it('sends a test payment simulation and shows a pending notice', async () => {
    const simulatePayment = vi
      .spyOn(customerApi, 'simulatePayment')
      .mockResolvedValue({
        status: 'PENDING',
        message: 'Simulasi pembayaran dikirim ke Xendit',
      })
    const { result } = renderHook(() =>
      useCustomerOrder({ tableCode: 'M01', quote, quoteItems }),
    )

    await act(async () => {
      await result.current.simulatePayment(order)
    })

    expect(simulatePayment).toHaveBeenCalledWith('M01', order.id)
    expect(result.current.simulationNotice).toContain('Menunggu status')
    expect(result.current.simulationError).toBeNull()
  })
})
