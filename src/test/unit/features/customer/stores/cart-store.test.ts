import { beforeEach, describe, expect, it } from 'vitest'
import {
  useCartStore,
  type CartLineInput,
} from '@/features/customer/stores/cart-store'

function line(overrides: Partial<CartLineInput> = {}): CartLineInput {
  return {
    menuItemId: 'menu-1',
    name: 'Nasi Goreng',
    imageUrl: null,
    basePrice: 28000,
    qty: 1,
    notes: null,
    modifierOptionIds: ['pedas'],
    modifiers: [
      {
        optionId: 'pedas',
        groupId: 'level',
        name: 'Pedas',
        priceDelta: 0,
      },
    ],
    ...overrides,
  }
}

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.setState({ tableCode: null, lines: [] })
  })

  it('merges the same item, modifier, and note', () => {
    useCartStore.getState().addLine(line())
    useCartStore.getState().addLine(line({ qty: 2 }))

    expect(useCartStore.getState().lines).toHaveLength(1)
    expect(useCartStore.getState().lines[0]?.qty).toBe(3)
  })

  it('keeps lines with different notes separate', () => {
    useCartStore.getState().addLine(line())
    useCartStore.getState().addLine(line({ notes: 'Tanpa bawang' }))

    expect(useCartStore.getState().lines).toHaveLength(2)
  })

  it('clamps quantity and removes a line', () => {
    useCartStore.getState().addLine(line())
    const id = useCartStore.getState().lines[0]!.id

    useCartStore.getState().setQty(id, 0)
    expect(useCartStore.getState().lines[0]?.qty).toBe(1)

    useCartStore.getState().setQty(id, 500)
    expect(useCartStore.getState().lines[0]?.qty).toBe(99)

    useCartStore.getState().removeLine(id)
    expect(useCartStore.getState().lines).toEqual([])
  })

  it('clears the cart when the table changes', () => {
    useCartStore.getState().setTable('T01')
    useCartStore.getState().addLine(line())

    useCartStore.getState().setTable('T02')

    expect(useCartStore.getState().tableCode).toBe('T02')
    expect(useCartStore.getState().lines).toEqual([])
  })

  it('updates modifiers and notes in place', () => {
    useCartStore.getState().addLine(line())
    const id = useCartStore.getState().lines[0]!.id

    useCartStore.getState().updateLine(id, line({ notes: 'Pedas sekali' }))

    expect(useCartStore.getState().lines[0]?.notes).toBe('Pedas sekali')
    expect(useCartStore.getState().lines[0]?.id).toBe(id)
  })
})
