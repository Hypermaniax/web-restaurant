import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { QuoteTotals } from '../api/types'
import type { CartLine } from '../stores/cart-store'
import { CartSheet } from './cart-sheet'

const line: CartLine = {
  id: 'line-1',
  menuItemId: 'menu-1',
  name: 'Nasi Goreng Rembuk',
  imageUrl: null,
  basePrice: 28000,
  qty: 1,
  notes: 'Tanpa bawang',
  modifierOptionIds: ['pedas'],
  modifiers: [
    {
      optionId: 'pedas',
      groupId: 'level',
      name: 'Pedas',
      priceDelta: 0,
    },
  ],
}

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

function renderSheet(overrides: Partial<Parameters<typeof CartSheet>[0]> = {}) {
  return render(
    <CartSheet
      open
      onOpenChange={vi.fn()}
      tableName="Meja 01"
      lines={[line]}
      quote={quote}
      quoteLoading={false}
      quoteError={null}
      onEdit={vi.fn()}
      onRemove={vi.fn()}
      onQtyChange={vi.fn()}
      onCheckout={vi.fn()}
      onRetryQuote={vi.fn()}
      {...overrides}
    />,
  )
}

describe('CartSheet', () => {
  it('edits, removes, changes quantity, and checks out', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    const onQtyChange = vi.fn()
    const onCheckout = vi.fn()

    renderSheet({ onEdit, onRemove, onQtyChange, onCheckout })

    expect(screen.getByText('Nasi Goreng Rembuk')).toBeInTheDocument()
    expect(screen.getByText('Pedas')).toBeInTheDocument()
    expect(screen.getByText('Catatan: Tanpa bawang')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Tambah Nasi Goreng Rembuk' }),
    )
    expect(onQtyChange).toHaveBeenCalledWith('line-1', 2)

    await user.click(screen.getByRole('button', { name: 'Ubah' }))
    expect(onEdit).toHaveBeenCalledWith(line)

    await user.click(
      screen.getByRole('button', { name: 'Hapus Nasi Goreng Rembuk' }),
    )
    expect(onRemove).toHaveBeenCalledWith('line-1')

    await user.click(
      screen.getByRole('button', { name: 'Lanjut ke pembayaran' }),
    )
    expect(onCheckout).toHaveBeenCalled()
  })

  it('lets an empty cart return to the menu', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    renderSheet({ lines: [], onOpenChange })

    await user.click(screen.getByRole('button', { name: 'Lihat menu' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
