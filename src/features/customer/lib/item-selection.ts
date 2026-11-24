import type {
  PublicMenuItem,
  PublicModifierGroup,
  PublicModifierOption,
} from '../api/types'
import type { CartModifier } from '../stores/cart-store'

export function defaultSelection(
  item: PublicMenuItem,
): Record<string, string[]> {
  return Object.fromEntries(
    item.modifierGroups.map((group) => {
      const defaults = group.options
        .filter((option) => option.isDefault)
        .map((option) => option.id)
      return [
        group.id,
        group.selectionType === 'SINGLE' ? defaults.slice(0, 1) : defaults,
      ]
    }),
  )
}

export function lineSelection(
  item: PublicMenuItem,
  optionIds: string[] | undefined,
): Record<string, string[]> {
  return Object.fromEntries(
    item.modifierGroups.map((group) => [
      group.id,
      (optionIds ?? []).filter((optionId) =>
        group.options.some((option) => option.id === optionId),
      ),
    ]),
  )
}

export function selectionRange(group: PublicModifierGroup) {
  const min = group.isRequired ? Math.max(1, group.minSelect) : group.minSelect
  const max =
    group.selectionType === 'SINGLE' ? 1 : (group.maxSelect ?? undefined)
  return { min, max }
}

export function selectionHint(group: PublicModifierGroup) {
  const { min, max } = selectionRange(group)
  if (min > 0 && max !== undefined) {
    return `Pilih ${min === max ? min : `${min}–${max}`}`
  }
  if (min > 0) {
    return `Pilih minimal ${min}`
  }
  if (max !== undefined) {
    return `Maksimal ${max}`
  }
  return 'Opsional'
}

export function selectedModifiers(
  item: PublicMenuItem,
  selected: Record<string, string[]>,
): CartModifier[] {
  return item.modifierGroups.flatMap((group) =>
    (selected[group.id] ?? []).flatMap((optionId) => {
      const option = group.options.find(
        (candidate) => candidate.id === optionId,
      )
      if (!option) return []
      return [
        {
          optionId: option.id,
          groupId: group.id,
          name: option.name,
          priceDelta: option.priceDelta,
        },
      ]
    }),
  )
}

export function getSelectionErrors(
  item: PublicMenuItem,
  selected: Record<string, string[]>,
): Record<string, string> {
  return Object.fromEntries(
    item.modifierGroups.flatMap((group) => {
      const count = (selected[group.id] ?? []).length
      const { min, max } = selectionRange(group)

      if (count < min) {
        return [
          [
            group.id,
            min === 1
              ? `Pilih ${group.name.toLowerCase()} terlebih dahulu.`
              : `Pilih minimal ${min} opsi untuk ${group.name.toLowerCase()}.`,
          ],
        ]
      }

      if (max !== undefined && count > max) {
        return [[group.id, `Pilih maksimal ${max} opsi untuk ${group.name}.`]]
      }

      return []
    }),
  )
}

export function quantityLabel(qty: number) {
  return `${qty} porsi`
}

export function nextSelection(
  group: PublicModifierGroup,
  option: PublicModifierOption,
  current: string[],
): string[] | null {
  const isSelected = current.includes(option.id)

  if (group.selectionType === 'SINGLE') {
    if (isSelected) {
      if (group.isRequired || group.minSelect > 0) return null
      return []
    }
    return [option.id]
  }

  const next = isSelected
    ? current.filter((id) => id !== option.id)
    : [...current, option.id]
  const max = group.maxSelect

  if (!isSelected && max !== null && next.length > max) {
    return null
  }

  return next
}
