import { z } from 'zod'
import type { ModifierGroup, ModifierOption, SelectionType } from '../api/types'

export const modifierGroupSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(80, 'Maksimal 80 karakter'),
  selectionType: z.enum(['SINGLE', 'MULTIPLE']),
  minSelect: z.number().int().min(0).max(100),
  maxSelect: z.number().int().min(0).max(100).nullable(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(100000),
})

export const modifierOptionSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(80, 'Maksimal 80 karakter'),
  priceDelta: z.number().int().min(0).max(100000000),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(100000),
})

export type ModifierGroupValues = z.infer<typeof modifierGroupSchema>
export type ModifierOptionValues = z.infer<typeof modifierOptionSchema>

export const emptyModifierGroup: ModifierGroupValues = {
  name: '',
  selectionType: 'SINGLE',
  minSelect: 1,
  maxSelect: 1,
  isRequired: true,
  isActive: true,
  sortOrder: 0,
}

export const emptyModifierOption: ModifierOptionValues = {
  name: '',
  priceDelta: 0,
  isDefault: false,
  isActive: true,
  sortOrder: 0,
}

export const selectionTypeLabel: Record<SelectionType, string> = {
  SINGLE: 'Pilih satu',
  MULTIPLE: 'Pilih banyak',
}

export function toModifierGroupValues(
  group: ModifierGroup,
): ModifierGroupValues {
  return {
    name: group.name,
    selectionType: group.selectionType,
    minSelect: group.minSelect,
    maxSelect: group.maxSelect,
    isRequired: group.isRequired,
    isActive: group.isActive,
    sortOrder: group.sortOrder,
  }
}

export function toModifierOptionValues(
  option: ModifierOption,
): ModifierOptionValues {
  return {
    name: option.name,
    priceDelta: option.priceDelta,
    isDefault: option.isDefault,
    isActive: option.isActive,
    sortOrder: option.sortOrder,
  }
}
