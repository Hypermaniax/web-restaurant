import { useMemo, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type {
  PublicMenuItem,
  PublicModifierGroup,
  PublicModifierOption,
} from '../api/types'
import type { CartLine, CartLineInput } from '../stores/cart-store'
import {
  defaultSelection,
  getSelectionErrors,
  lineSelection,
  nextSelection,
  selectedModifiers,
} from '../lib/item-selection'
import { ItemModifierGroup } from './item-modifier-group'
import { ItemNotesField } from './item-notes-field'
import { ItemSheetFooter } from './item-sheet-footer'
import { ItemSheetSummary } from './item-sheet-summary'

interface ItemSheetProps {
  item: PublicMenuItem
  line?: CartLine | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (line: CartLineInput) => void
}

export function ItemSheet({
  item,
  line,
  open,
  onOpenChange,
  onSave,
}: ItemSheetProps) {
  const [selected, setSelected] = useState<Record<string, string[]>>(() =>
    line ? lineSelection(item, line.modifierOptionIds) : defaultSelection(item),
  )
  const [qty, setQty] = useState(line?.qty ?? 1)
  const [notes, setNotes] = useState(line?.notes ?? '')
  const [showErrors, setShowErrors] = useState(false)

  const errors = useMemo(
    () => getSelectionErrors(item, selected),
    [item, selected],
  )

  function toggleOption(
    group: PublicModifierGroup,
    option: PublicModifierOption,
  ) {
    const next = nextSelection(group, option, selected[group.id] ?? [])
    if (!next) return
    setSelected({ ...selected, [group.id]: next })
  }

  function handleSave() {
    setShowErrors(true)

    if (!item.isAvailable || Object.keys(errors).length > 0) return

    const modifiers = selectedModifiers(item, selected)
    onSave({
      menuItemId: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      basePrice: item.price,
      qty,
      notes,
      modifierOptionIds: modifiers.map((modifier) => modifier.optionId),
      modifiers,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl sm:rounded-t-[2rem]"
      >
        <SheetHeader className="border-pine/10 border-b p-5 pr-14">
          <SheetTitle className="font-display text-2xl tracking-tight">
            {line ? 'Ubah pesanan' : item.name}
          </SheetTitle>
          <SheetDescription className="text-pine/60">
            {item.description ??
              'Pilih tambahan dan jumlah porsi sebelum masuk ke pesanan.'}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <ItemSheetSummary item={item} />

          <div className="mt-7 flex flex-col gap-6">
            {item.modifierGroups.map((group) => (
              <ItemModifierGroup
                key={group.id}
                group={group}
                value={selected[group.id] ?? []}
                error={errors[group.id]}
                showError={showErrors}
                onToggle={toggleOption}
              />
            ))}

            <ItemNotesField notes={notes} onChange={setNotes} />
          </div>
        </div>

        <ItemSheetFooter
          qty={qty}
          line={line}
          isAvailable={item.isAvailable}
          onDecrease={() => setQty((current) => Math.max(1, current - 1))}
          onIncrease={() => setQty((current) => Math.min(99, current + 1))}
          onSave={handleSave}
        />
      </SheetContent>
    </Sheet>
  )
}
