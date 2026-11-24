import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useCashierTables } from '../api/admin-api'
import { useCancelOrder, useOrders, type Order } from '../api/orders-api'
import { useCashierRealtime } from '../hooks/use-cashier-realtime'
import { OrdersPage } from './orders-page'

vi.mock('../api/admin-api', () => ({
  useCashierTables: vi.fn(),
}))

vi.mock('../api/orders-api', () => ({
  useOrders: vi.fn(),
  useCancelOrder: vi.fn(),
}))

vi.mock('../hooks/use-cashier-realtime', () => ({
  useCashierRealtime: vi.fn(),
}))

function makeOrder(overrides: Partial<Order>): Order {
  return {
    id: 'order-1',
    orderNumber: '20261122-0001',
    orderType: 'DINE_IN',
    source: 'CUSTOMER_QR',
    status: 'PENDING_PAYMENT',
    paymentStatus: 'PENDING',
    table: { id: 'table-1', code: 'T01', name: 'Meja 1' },
    sessionId: null,
    queueNumber: null,
    queueDisplay: null,
    customerName: null,
    notes: null,
    currency: 'IDR',
    subtotal: 100_000,
    discountAmount: 0,
    serviceAmount: 0,
    taxAmount: 0,
    total: 100_000,
    taxInclusive: false,
    taxBaseIncludesService: false,
    taxRateBp: 0,
    serviceRateBp: 0,
    expiresAt: '2026-11-22T07:15:00.000Z',
    paidAt: null,
    preparingAt: null,
    readyAt: null,
    servedAt: null,
    cancelledAt: null,
    cancelReason: null,
    createdAt: '2026-11-22T07:00:00.000Z',
    items: [],
    payments: [],
    ...overrides,
  }
}

function renderPage() {
  return render(
    <MemoryRouter>
      <OrdersPage />
    </MemoryRouter>,
  )
}

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.mocked(useCashierRealtime).mockReturnValue(false)
    vi.mocked(useCashierTables).mockReturnValue({
      data: [],
    } as never)
    vi.mocked(useCancelOrder).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never)
  })

  it('shows filters and only allows cancel for unpaid orders', () => {
    vi.mocked(useOrders).mockReturnValue({
      data: {
        items: [
          makeOrder({}),
          makeOrder({
            id: 'order-2',
            orderNumber: '20261122-0002',
            status: 'PAID',
            paymentStatus: 'PAID',
            queueNumber: 1,
            queueDisplay: 'A-001',
            paidAt: '2026-11-22T07:05:00.000Z',
          }),
        ],
        meta: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: vi.fn(),
    } as never)

    renderPage()

    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipe order')).toBeInTheDocument()
    expect(screen.getByLabelText('Sumber')).toBeInTheDocument()
    expect(screen.getByLabelText('Meja')).toBeInTheDocument()
    expect(screen.getByLabelText('Tanggal bisnis')).toBeInTheDocument()
    expect(screen.getByText('Antrian A-001')).toBeInTheDocument()
    expect(screen.getByLabelText('Batalkan 20261122-0001')).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Batalkan 20261122-0002'),
    ).not.toBeInTheDocument()
  })

  it('passes the selected date to the order query', () => {
    vi.mocked(useOrders).mockReturnValue({
      data: {
        items: [],
        meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      refetch: vi.fn(),
    } as never)

    renderPage()

    fireEvent.change(screen.getByLabelText('Tanggal bisnis'), {
      target: { value: '2026-11-22' },
    })

    const lastFilters = vi.mocked(useOrders).mock.calls.at(-1)?.[0]
    expect(lastFilters).toMatchObject({ date: '2026-11-22' })
  })
})
