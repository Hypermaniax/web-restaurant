import { z } from 'zod'
import type { MenuItemInput } from '../api/admin-api'
import type { MenuItem } from '../api/types'

export const menuSchema = z.object({
  categoryId: z.string().min(1, 'Pilih kategori'),
  name: z.string().min(1, 'Nama wajib diisi').max(120, 'Maksimal 120 karakter'),
  description: z.string().max(1000, 'Maksimal 1.000 karakter'),
  price: z.number().int().min(0).max(100000000),
  sortOrder: z.number().int().min(0).max(100000),
  isAvailable: z.boolean(),
  isActive: z.boolean(),
  modifierGroupIds: z.array(z.string()),
})

export type MenuValues = z.infer<typeof menuSchema>

export const emptyMenuValues: MenuValues = {
  categoryId: '',
  name: '',
  description: '',
  price: 0,
  sortOrder: 0,
  isAvailable: true,
  isActive: true,
  modifierGroupIds: [],
}

export function toMenuValues(item: MenuItem): MenuValues {
  return {
    categoryId: item.categoryId,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    sortOrder: item.sortOrder,
    isAvailable: item.isAvailable,
    isActive: item.isActive,
    modifierGroupIds: item.modifierGroups.map((group) => group.id),
  }
}

export function toMenuInput(values: MenuValues): MenuItemInput {
  return {
    ...values,
    description: values.description.trim() || null,
  }
}
