import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { QuoteTotals } from '@/features/customer/api/types'
import type { CartLine } from '@/features/customer/stores/cart-store'
import { CheckoutPanel } from '@/features/customer/components/checkout-panel'

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

const line: CartLine = {
  id: 'line-1',
  menuItemId: 'menu-1',
  name: 'Nasi Goreng Rembuk',
  imageUrl: null,
  basePrice: 28000,
  qty: 1,
  notes: null,
  modifierOptionIds: ['pedas'],
  modifiers: [
    {
      optionId: 'pedas',
      groupId: 'level',
      name: 'Tidak Pedas',
      priceDelta: 0,
    },
  ],
}

describe('CheckoutPanel', () => {
  it('submits customer details and the selected payment method', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <CheckoutPanel
        tableName="Meja 01"
        lines={[line]}
        quote={quote}
        quoteLoading={false}
        quoteError={null}
        submitting={false}
        submitError={null}
        onBack={vi.fn()}
        onSubmit={onSubmit}
        onRetryQuote={vi.fn()}
      />,
    )

    expect(screen.getByText('Rp 32.340')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Nama'), 'Budi')
    await user.click(screen.getByRole('radio', { name: /Tunai di kasir/ }))
    await user.click(screen.getByRole('button', { name: /Buat pesanan/ }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        customerName: 'Budi',
        paymentMethod: 'CASH',
      }),
    )
  })
})
