import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { PublicMenuItem } from '../api/types'
import type { CartLine, CartLineInput } from '../stores/cart-store'
import { useItemSheetState } from '../hooks/use-item-sheet-state'
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
  const {
    selected,
    qty,
    notes,
    showErrors,
    errors,
    modifiers,
    toggleOption,
    decreaseQty,
    increaseQty,
    setNotes,
    validate,
  } = useItemSheetState(item, line)

  function handleSave() {
    if (!validate()) return

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
          onDecrease={decreaseQty}
          onIncrease={increaseQty}
          onSave={handleSave}
        />
      </SheetContent>
    </Sheet>
  )
}
