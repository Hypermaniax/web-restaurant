import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CreatedOrder, QrisPayment } from '@/features/customer/api/types'
import { PaymentPanel } from '@/features/customer/components/payment-panel'

const order: CreatedOrder = {
  id: 'order-1',
  orderNumber: '20261122-0999',
  orderType: 'DINE_IN',
  status: 'PAID',
  paymentStatus: 'PAID',
  table: {
    id: 'table-1',
    code: 'T01',
    name: 'Meja 01',
  },
  queueNumber: 12,
  queueDisplay: 'A-012',
  customerName: 'Budi',
  notes: null,
  subtotal: 28000,
  discountAmount: 0,
  serviceAmount: 1400,
  taxAmount: 2940,
  total: 32340,
  taxInclusive: false,
  taxBaseIncludesService: true,
  taxRateBp: 1000,
  serviceRateBp: 500,
  expiresAt: new Date(Date.now() + 60_000).toISOString(),
  createdAt: new Date().toISOString(),
}

const qris: QrisPayment = {
  paymentId: 'payment-1',
  referenceId: 'ref-1',
  status: 'PENDING',
  amount: 32340,
  qrString: '00020101021226570011ID.CO.QRIS.WWW',
  expiresAt: new Date(Date.now() + 60_000).toISOString(),
}

function renderPanel(
  overrides: Partial<Parameters<typeof PaymentPanel>[0]> = {},
) {
  return render(
    <PaymentPanel
      order={order}
      tableName="Meja 01"
      method="CASH"
      qris={null}
      preparing={false}
      paymentError={null}
      status={{ status: 'PAID', queueNumber: 12, queueDisplay: 'A-012' }}
      statusLoading={false}
      statusError={null}
      simulatorEnabled={false}
      simulating={false}
      simulationError={null}
      simulationNotice={null}
      onRetryQris={vi.fn()}
      onSwitchCash={vi.fn()}
      onSimulatePayment={vi.fn()}
      onRefreshStatus={vi.fn()}
      onBackToMenu={vi.fn()}
      {...overrides}
    />,
  )
}

describe('PaymentPanel', () => {
  it('shows the queue number after payment and lets the customer order again', async () => {
    const user = userEvent.setup()
    const onBackToMenu = vi.fn()

    renderPanel({ onBackToMenu })

    expect(screen.getByText('A-012')).toBeInTheDocument()
    expect(screen.getByText('Pembayaran diterima.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Pesan lagi' }))
    expect(onBackToMenu).toHaveBeenCalled()
  })

  it('shows the QRIS code and refreshes payment status', async () => {
    const user = userEvent.setup()
    const onRefreshStatus = vi.fn()

    renderPanel({
      method: 'QRIS',
      qris,
      status: { status: 'PENDING', queueNumber: null, queueDisplay: null },
      onRefreshStatus,
    })

    expect(screen.getByTitle('QRIS pembayaran')).toBeInTheDocument()
    expect(screen.getByText('Sisa waktu bayar')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cek status' }))
    expect(onRefreshStatus).toHaveBeenCalled()
  })

  it('shows the test simulator and sends a simulation request', async () => {
    const user = userEvent.setup()
    const onSimulatePayment = vi.fn()

    renderPanel({
      method: 'QRIS',
      qris,
      status: { status: 'PENDING', queueNumber: null, queueDisplay: null },
      simulatorEnabled: true,
      onSimulatePayment,
    })

    await user.click(
      screen.getByRole('button', { name: 'Simulasikan bayar (test)' }),
    )
    expect(onSimulatePayment).toHaveBeenCalled()
  })

  it('hides the test simulator when disabled', () => {
    renderPanel({
      method: 'QRIS',
      qris,
      status: { status: 'PENDING', queueNumber: null, queueDisplay: null },
    })

    expect(
      screen.queryByRole('button', { name: 'Simulasikan bayar (test)' }),
    ).not.toBeInTheDocument()
  })

  it('shows an expired QR state', () => {
    renderPanel({
      method: 'QRIS',
      qris: { ...qris, expiresAt: new Date(Date.now() - 60_000).toISOString() },
      status: { status: 'PENDING', queueNumber: null, queueDisplay: null },
    })

    expect(screen.getByText('QR kedaluwarsa')).toBeInTheDocument()
  })

  it('shows an expired order state', () => {
    renderPanel({
      order: { ...order, paymentStatus: 'EXPIRED', status: 'EXPIRED' },
      status: { status: 'EXPIRED', queueNumber: null, queueDisplay: null },
    })

    expect(screen.getByText('Pesanan kedaluwarsa')).toBeInTheDocument()
  })
})
