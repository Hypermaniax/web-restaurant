import type { PublicCategory } from '@/features/customer/api/types'
import { filterMenuCategories } from '@/features/customer/lib/menu'

const categories: PublicCategory[] = [
  {
    id: 'food',
    name: 'Makanan',
    sortOrder: 0,
    items: [
      {
        id: 'nasi',
        name: 'Nasi Goreng',
        description: 'Pedas gurih',
        price: 28000,
        imageUrl: null,
        isAvailable: true,
        sortOrder: 0,
        modifierGroups: [],
      },
      {
        id: 'mie',
        name: 'Mie Goreng',
        description: null,
        price: 26000,
        imageUrl: null,
        isAvailable: true,
        sortOrder: 1,
        modifierGroups: [],
      },
    ],
  },
  {
    id: 'drink',
    name: 'Minuman',
    sortOrder: 1,
    items: [
      {
        id: 'tea',
        name: 'Es Teh',
        description: 'Manis dingin',
        price: 8000,
        imageUrl: null,
        isAvailable: true,
        sortOrder: 0,
        modifierGroups: [],
      },
    ],
  },
]

describe('filterMenuCategories', () => {
  it('filters by category and search text', () => {
    expect(filterMenuCategories(categories, 'teh', 'all')).toEqual([
      expect.objectContaining({
        id: 'drink',
        items: [expect.objectContaining({ id: 'tea' })],
      }),
    ])
    expect(filterMenuCategories(categories, '', 'food')).toEqual([
      expect.objectContaining({ id: 'food' }),
    ])
  })

  it('matches item descriptions and drops empty categories', () => {
    expect(filterMenuCategories(categories, 'manis', 'all')).toEqual([
      expect.objectContaining({
        id: 'drink',
        items: [expect.objectContaining({ id: 'tea' })],
      }),
    ])
    expect(filterMenuCategories(categories, 'pizza', 'all')).toEqual([])
  })
})
