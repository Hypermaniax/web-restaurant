import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SheetFooter } from '@/components/ui/sheet'
import type { CartLine } from '../stores/cart-store'
import { quantityLabel } from '../lib/item-selection'

interface ItemSheetFooterProps {
  qty: number
  line: CartLine | null | undefined
  isAvailable: boolean
  onDecrease: () => void
  onIncrease: () => void
  onSave: () => void
}

export function ItemSheetFooter({
  qty,
  line,
  isAvailable,
  onDecrease,
  onIncrease,
  onSave,
}: ItemSheetFooterProps) {
  return (
    <SheetFooter className="border-pine/10 bg-card/95 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="border-pine/10 bg-rice flex w-full items-center justify-between rounded-full border p-1 sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Kurangi jumlah"
            disabled={qty <= 1}
            onClick={onDecrease}
            className="size-9 rounded-full"
          >
            <Minus />
          </Button>
          <span className="w-20 text-center text-sm font-semibold whitespace-nowrap tabular-nums">
            {quantityLabel(qty)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Tambah jumlah"
            disabled={qty >= 99}
            onClick={onIncrease}
            className="size-9 rounded-full"
          >
            <Plus />
          </Button>
        </div>

        <Button
          type="button"
          variant="accent"
          size="lg"
          className="w-full flex-1"
          disabled={!isAvailable}
          onClick={onSave}
        >
          {isAvailable
            ? line
              ? 'Simpan perubahan'
              : 'Tambah ke pesanan'
            : 'Menu habis'}
        </Button>
      </div>
    </SheetFooter>
  )
}
