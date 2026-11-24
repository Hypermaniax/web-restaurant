import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Order } from '../api/orders-api'
import { OrderDetailSheet } from './order-detail-sheet'

const order: Order = {
  id: 'order-1',
  orderNumber: '20261122-0001',
  orderType: 'DINE_IN',
  source: 'CUSTOMER_QR',
  status: 'PENDING_PAYMENT',
  paymentStatus: 'PENDING',
  table: { id: 'table-1', code: 'T01', name: 'Meja 01' },
  sessionId: null,
  queueNumber: null,
  queueDisplay: null,
  customerName: 'Budi',
  notes: 'Saus terpisah',
  currency: 'IDR',
  subtotal: 28000,
  discountAmount: 0,
  serviceAmount: 1400,
  taxAmount: 2940,
  total: 32340,
  taxInclusive: false,
  taxBaseIncludesService: true,
  taxRateBp: 1000,
  serviceRateBp: 500,
  expiresAt: '2026-11-22T10:15:00.000Z',
  paidAt: null,
  preparingAt: null,
  readyAt: null,
  servedAt: null,
  cancelledAt: null,
  cancelReason: null,
  createdAt: '2026-11-22T10:00:00.000Z',
  items: [
    {
      id: 'item-1',
      menuItemId: 'menu-1',
      nameSnapshot: 'Nasi Goreng Rembuk',
      unitPrice: 28000,
      qty: 1,
      notes: null,
      lineTotal: 28000,
      modifiers: [
        {
          id: 'modifier-1',
          modifierOptionId: 'pedas',
          nameSnapshot: 'Pedas',
          priceDelta: 0,
          qty: 1,
        },
      ],
    },
  ],
  payments: [
    {
      id: 'payment-1',
      provider: 'XENDIT',
      method: 'QRIS',
      status: 'PENDING',
      amount: 32340,
      paidAt: null,
    },
  ],
}

function renderSheet() {
  return render(
    <OrderDetailSheet
      order={order}
      open
      onOpenChange={vi.fn()}
      onCancel={vi.fn()}
    />,
  )
}

describe('OrderDetailSheet', () => {
  it('renders order contents and allows cancelling an unpaid order', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <OrderDetailSheet
        order={order}
        open
        onOpenChange={vi.fn()}
        onCancel={onCancel}
      />,
    )

    expect(screen.getByText('Order 20261122-0001')).toBeInTheDocument()
    expect(screen.getByText('Meja T01 · Meja 01 · QR meja')).toBeInTheDocument()
    expect(screen.getByText('1× Nasi Goreng Rembuk')).toBeInTheDocument()
    expect(screen.getByText('+ Pedas')).toBeInTheDocument()
    expect(screen.getByText('Budi')).toBeInTheDocument()
    expect(screen.getByText('Saus terpisah')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Batalkan order' }))
    expect(onCancel).toHaveBeenCalledWith(order)
  })

  it('shows a placeholder when the queue number is not assigned', () => {
    renderSheet()

    expect(
      screen.getByText(
        'Nomor antrian diberikan setelah pembayaran dikonfirmasi.',
      ),
    ).toBeInTheDocument()
  })
})
