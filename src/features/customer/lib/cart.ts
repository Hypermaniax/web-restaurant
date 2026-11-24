import type { CartLine } from '../stores/cart-store'
import type { QuoteInputItem } from '../api/types'

export function toQuoteItems(lines: CartLine[]): QuoteInputItem[] {
  return lines.map((line) => ({
    menuItemId: line.menuItemId,
    qty: line.qty,
    modifierOptionIds:
      line.modifierOptionIds.length > 0 ? line.modifierOptionIds : undefined,
    notes: line.notes,
  }))
}

export function totalQuantity(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.qty, 0)
}

export function formatRateBp(rateBp: number): string {
  return `${new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(rateBp / 100)}%`
}
