import { useCallback, useMemo, useReducer } from 'react'
import type {
  PublicMenuItem,
  PublicModifierGroup,
  PublicModifierOption,
} from '../api/types'
import {
  defaultSelection,
  getSelectionErrors,
  lineSelection,
  nextSelection,
  selectedModifiers,
} from '../lib/item-selection'
import type { CartLine } from '../stores/cart-store'

const MIN_QUANTITY = 1
const MAX_QUANTITY = 99

interface ItemSheetState {
  selected: Record<string, string[]>
  qty: number
  notes: string
  showErrors: boolean
}

type ItemSheetAction =
  | {
      type: 'toggleOption'
      group: PublicModifierGroup
      option: PublicModifierOption
    }
  | { type: 'decreaseQty' }
  | { type: 'increaseQty' }
  | { type: 'setNotes'; notes: string }
  | { type: 'showErrors' }

function createInitialState({
  item,
  line,
}: {
  item: PublicMenuItem
  line?: CartLine | null
}): ItemSheetState {
  return {
    selected: line
      ? lineSelection(item, line.modifierOptionIds)
      : defaultSelection(item),
    qty: line?.qty ?? MIN_QUANTITY,
    notes: line?.notes ?? '',
    showErrors: false,
  }
}

function clampQuantity(qty: number): number {
  return Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, qty))
}

function itemSheetReducer(
  state: ItemSheetState,
  action: ItemSheetAction,
): ItemSheetState {
  switch (action.type) {
    case 'toggleOption': {
      const current = state.selected[action.group.id] ?? []
      const next = nextSelection(action.group, action.option, current)
      if (next === null) return state

      return {
        ...state,
        selected: { ...state.selected, [action.group.id]: next },
      }
    }
    case 'decreaseQty':
      return { ...state, qty: clampQuantity(state.qty - 1) }
    case 'increaseQty':
      return { ...state, qty: clampQuantity(state.qty + 1) }
    case 'setNotes':
      return { ...state, notes: action.notes }
    case 'showErrors':
      return state.showErrors ? state : { ...state, showErrors: true }
  }
}

export function useItemSheetState(
  item: PublicMenuItem,
  line?: CartLine | null,
) {
  const [state, dispatch] = useReducer(
    itemSheetReducer,
    { item, line },
    createInitialState,
  )

  const errors = useMemo(
    () => getSelectionErrors(item, state.selected),
    [item, state.selected],
  )
  const modifiers = useMemo(
    () => selectedModifiers(item, state.selected),
    [item, state.selected],
  )

  const toggleOption = useCallback(
    (group: PublicModifierGroup, option: PublicModifierOption) => {
      dispatch({ type: 'toggleOption', group, option })
    },
    [],
  )

  const decreaseQty = useCallback(() => {
    dispatch({ type: 'decreaseQty' })
  }, [])

  const increaseQty = useCallback(() => {
    dispatch({ type: 'increaseQty' })
  }, [])

  const setNotes = useCallback((notes: string) => {
    dispatch({ type: 'setNotes', notes })
  }, [])

  const validate = useCallback(() => {
    dispatch({ type: 'showErrors' })
    return item.isAvailable && Object.keys(errors).length === 0
  }, [errors, item.isAvailable])

  return {
    selected: state.selected,
    qty: state.qty,
    notes: state.notes,
    showErrors: state.showErrors,
    errors,
    modifiers,
    toggleOption,
    decreaseQty,
    increaseQty,
    setNotes,
    validate,
  }
}
