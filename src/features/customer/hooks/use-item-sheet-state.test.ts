import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { PublicMenuItem } from '../api/types'
import type { CartLine } from '../stores/cart-store'
import { useItemSheetState } from './use-item-sheet-state'

const item: PublicMenuItem = {
  id: 'menu-1',
  name: 'Nasi Goreng Rembuk',
  description: null,
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

describe('useItemSheetState', () => {
  it('starts with validation errors when a required modifier is empty', () => {
    const { result } = renderHook(() => useItemSheetState(item))

    expect(result.current.qty).toBe(1)
    expect(result.current.errors).toEqual({
      level: 'Pilih level pedas terlebih dahulu.',
    })
  })

  it('updates modifier, quantity, notes, and validates the selection', () => {
    const { result } = renderHook(() => useItemSheetState(item))
    const group = item.modifierGroups[0]

    act(() => result.current.toggleOption(group, group.options[1]))
    act(() => result.current.increaseQty())
    act(() => result.current.setNotes('Tanpa bawang'))

    expect(result.current.selected.level).toEqual(['pedas'])
    expect(result.current.qty).toBe(2)
    expect(result.current.notes).toBe('Tanpa bawang')
    expect(result.current.modifiers).toEqual([
      {
        optionId: 'pedas',
        groupId: 'level',
        name: 'Pedas',
        priceDelta: 0,
      },
    ])

    let valid = false
    act(() => {
      valid = result.current.validate()
    })

    expect(valid).toBe(true)
    expect(result.current.showErrors).toBe(true)
    expect(result.current.errors).toEqual({})
  })

  it('uses the existing cart line as initial state', () => {
    const line: CartLine = {
      id: 'line-1',
      menuItemId: item.id,
      name: item.name,
      imageUrl: null,
      basePrice: item.price,
      qty: 3,
      notes: 'Pedas',
      modifierOptionIds: ['sedang'],
      modifiers: [],
    }

    const { result } = renderHook(() => useItemSheetState(item, line))

    expect(result.current.qty).toBe(3)
    expect(result.current.notes).toBe('Pedas')
    expect(result.current.selected.level).toEqual(['sedang'])
    expect(result.current.errors).toEqual({})
  })
})
