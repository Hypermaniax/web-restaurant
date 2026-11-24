import type { ModifierGroup, ModifierOption } from '@/features/admin/api/types'
import {
  emptyModifierGroup,
  emptyModifierOption,
  selectionTypeLabel,
  toModifierGroupValues,
  toModifierOptionValues,
} from '@/features/admin/lib/modifier-form'

const option: ModifierOption = {
  id: 'option-1',
  groupId: 'group-1',
  name: 'Pedas sedang',
  priceDelta: 2000,
  isDefault: true,
  isActive: true,
  sortOrder: 2,
}

const group: ModifierGroup = {
  id: 'group-1',
  outletId: 'outlet-1',
  name: 'Level Pedas',
  selectionType: 'MULTIPLE',
  minSelect: 1,
  maxSelect: 3,
  isRequired: true,
  isActive: false,
  sortOrder: 1,
  options: [option],
}

describe('modifier form mapping', () => {
  it('maps a modifier group and option into editable values', () => {
    expect(toModifierGroupValues(group)).toEqual({
      name: 'Level Pedas',
      selectionType: 'MULTIPLE',
      minSelect: 1,
      maxSelect: 3,
      isRequired: true,
      isActive: false,
      sortOrder: 1,
    })
    expect(toModifierOptionValues(option)).toEqual({
      name: 'Pedas sedang',
      priceDelta: 2000,
      isDefault: true,
      isActive: true,
      sortOrder: 2,
    })
  })

  it('keeps create defaults and selection labels', () => {
    expect(emptyModifierGroup.maxSelect).toBe(1)
    expect(emptyModifierOption.priceDelta).toBe(0)
    expect(selectionTypeLabel).toEqual({
      SINGLE: 'Pilih satu',
      MULTIPLE: 'Pilih banyak',
    })
  })
})
