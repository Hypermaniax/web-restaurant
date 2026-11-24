import { create } from 'zustand'

export interface CartModifier {
  optionId: string
  groupId: string
  name: string
  priceDelta: number
}

export interface CartLine {
  id: string
  menuItemId: string
  name: string
  imageUrl: string | null
  basePrice: number
  qty: number
  notes: string | null
  modifierOptionIds: string[]
  modifiers: CartModifier[]
}

export type CartLineInput = Omit<CartLine, 'id'>

interface CartState {
  tableCode: string | null
  lines: CartLine[]
  setTable: (tableCode: string) => void
  addLine: (line: CartLineInput) => void
  updateLine: (lineId: string, line: CartLineInput) => void
  setQty: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  clear: () => void
}

function createId(): string {
  const randomUUID = globalThis.crypto?.randomUUID
  if (typeof randomUUID === 'function') {
    return randomUUID.call(globalThis.crypto)
  }
  return `line-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeNotes(notes: string | null | undefined): string | null {
  const value = notes?.trim()
  return value ? value : null
}

function clampQty(qty: number): number {
  return Math.max(1, Math.min(99, Math.round(qty)))
}

function lineKey(line: CartLineInput): string {
  return JSON.stringify({
    menuItemId: line.menuItemId,
    modifierOptionIds: [...line.modifierOptionIds].sort(),
    notes: normalizeNotes(line.notes),
  })
}

export const useCartStore = create<CartState>((set) => ({
  tableCode: null,
  lines: [],
  setTable: (tableCode) =>
    set((state) =>
      state.tableCode === tableCode ? state : { tableCode, lines: [] },
    ),
  addLine: (line) =>
    set((state) => {
      const next: CartLineInput = {
        ...line,
        qty: clampQty(line.qty),
        notes: normalizeNotes(line.notes),
      }
      const existing = state.lines.find(
        (candidate) => lineKey(candidate) === lineKey(next),
      )

      if (existing) {
        return {
          lines: state.lines.map((candidate) =>
            candidate.id === existing.id
              ? { ...candidate, qty: clampQty(candidate.qty + next.qty) }
              : candidate,
          ),
        }
      }

      return {
        lines: [...state.lines, { ...next, id: createId() }],
      }
    }),
  updateLine: (lineId, line) =>
    set((state) => ({
      lines: state.lines.map((candidate) =>
        candidate.id === lineId
          ? {
              ...candidate,
              ...line,
              qty: clampQty(line.qty),
              notes: normalizeNotes(line.notes),
            }
          : candidate,
      ),
    })),
  setQty: (lineId, qty) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.id === lineId ? { ...line, qty: clampQty(qty) } : line,
      ),
    })),
  removeLine: (lineId) =>
    set((state) => ({
      lines: state.lines.filter((line) => line.id !== lineId),
    })),
  clear: () => set({ lines: [] }),
}))
