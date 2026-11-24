import type { MenuItem } from '../api/types'
import { emptyMenuValues, toMenuInput, toMenuValues } from './menu-form'

const item: MenuItem = {
  id: 'menu-1',
  outletId: 'outlet-1',
  categoryId: 'food',
  categoryName: 'Makanan',
  name: 'Nasi Goreng Rembuk',
  description: 'Pedas gurih',
  price: 28000,
  imageUrl: null,
  isAvailable: true,
  isActive: false,
  sortOrder: 2,
  modifierGroups: [],
  createdAt: '2026-11-22T00:00:00.000Z',
  updatedAt: '2026-11-22T00:00:00.000Z',
}

describe('menu form mapping', () => {
  it('maps a menu item into editable values', () => {
    expect(toMenuValues(item)).toEqual({
      categoryId: 'food',
      name: 'Nasi Goreng Rembuk',
      description: 'Pedas gurih',
      price: 28000,
      sortOrder: 2,
      isAvailable: true,
      isActive: false,
      modifierGroupIds: [],
    })
  })

  it('trims description into the API payload', () => {
    expect(
      toMenuInput({ ...emptyMenuValues, description: '  Pedas  ' }),
    ).toMatchObject({ description: 'Pedas' })
    expect(toMenuInput(emptyMenuValues).description).toBeNull()
  })
})
