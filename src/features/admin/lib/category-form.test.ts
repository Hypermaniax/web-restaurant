import type { Category } from '../api/types'
import { categorySchema, toCategoryValues } from './category-form'

const category: Category = {
  id: 'category-1',
  outletId: 'outlet-1',
  name: 'Makanan',
  sortOrder: 2,
  isActive: true,
}

describe('category form', () => {
  it('maps a category into form values', () => {
    expect(toCategoryValues(category)).toEqual({
      name: 'Makanan',
      sortOrder: 2,
      isActive: true,
    })
  })

  it('rejects empty names and negative order', () => {
    expect(
      categorySchema.safeParse({
        name: '',
        sortOrder: -1,
        isActive: true,
      }).success,
    ).toBe(false)
  })
})
