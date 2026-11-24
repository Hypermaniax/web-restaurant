import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { PublicMenuItem } from '../api/types'
import { ItemSheet } from './item-sheet'

const item: PublicMenuItem = {
  id: 'menu-1',
  name: 'Nasi Goreng Rembuk',
  description: 'Nasi goreng kampung.',
  price: 28000,
  imageUrl: null,
  isAvailable: true,
  sortOrder: 1,
  modifierGroups: [
    {
      id: 'level',
      name: 'Level Pedas',
      selectionType: 'SINGLE',
      minSelect: 1,
      maxSelect: 1,
      isRequired: true,
      sortOrder: 1,
      options: [
        {
          id: 'sedang',
          name: 'Sedang',
          priceDelta: 0,
          isDefault: false,
          sortOrder: 1,
        },
        {
          id: 'pedas',
          name: 'Pedas',
          priceDelta: 0,
          isDefault: false,
          sortOrder: 2,
        },
      ],
    },
  ],
}

describe('ItemSheet', () => {
  it('requires a modifier before adding the item', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <ItemSheet item={item} open onOpenChange={vi.fn()} onSave={onSave} />,
    )

    await user.click(screen.getByRole('button', { name: 'Tambah ke pesanan' }))

    expect(
      screen.getByText('Pilih level pedas terlebih dahulu.'),
    ).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Pedas' }))
    await user.click(screen.getByRole('button', { name: 'Tambah ke pesanan' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        menuItemId: 'menu-1',
        qty: 1,
        modifierOptionIds: ['pedas'],
      }),
    )
  })
})
