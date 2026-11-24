import { z } from 'zod'
import type { Category } from '../api/types'

export const categorySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(80, 'Maksimal 80 karakter'),
  sortOrder: z.number().int().min(0).max(100000),
  isActive: z.boolean(),
})

export type CategoryValues = z.infer<typeof categorySchema>

export const emptyCategoryValues: CategoryValues = {
  name: '',
  sortOrder: 0,
  isActive: true,
}

export function toCategoryValues(category: Category): CategoryValues {
  return {
    name: category.name,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
  }
}
