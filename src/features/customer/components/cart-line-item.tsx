import { Minus, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/assets'
import { formatCurrency } from '@/lib/format'
import type { CartLine } from '../stores/cart-store'

interface CartLineItemProps {
  line: CartLine
  onEdit: (line: CartLine) => void
  onRemove: (lineId: string) => void
  onQtyChange: (lineId: string, qty: number) => void
}

export function CartLineItem({
  line,
  onEdit,
  onRemove,
  onQtyChange,
}: CartLineItemProps) {
  const image = assetUrl(line.imageUrl)
  const modifierLabel = line.modifiers
    .map((modifier) => modifier.name)
    .join(' · ')

  return (
    <div className="flex gap-3 py-4 first:pt-0">
      <div className="bg-mint text-pine/50 grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl text-xl font-semibold">
        {image ? (
          <img src={image} alt={line.name} className="size-full object-cover" />
        ) : (
          line.name.slice(0, 1).toUpperCase()
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-pine truncate text-sm font-semibold">
              {line.name}
            </p>
            {modifierLabel ? (
              <p className="text-pine/55 mt-1 text-xs leading-5">
                {modifierLabel}
              </p>
            ) : null}
            {line.notes ? (
              <p className="text-chili mt-1 text-xs leading-5">
                Catatan: {line.notes}
              </p>
            ) : null}
          </div>
          <p className="text-pine/70 shrink-0 text-xs font-medium tabular-nums">
            {formatCurrency(line.basePrice)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="border-pine/10 flex items-center rounded-full border p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              aria-label={`Kurangi ${line.name}`}
              disabled={line.qty <= 1}
              onClick={() => onQtyChange(line.id, line.qty - 1)}
            >
              <Minus />
            </Button>
            <span className="w-8 text-center text-xs font-semibold tabular-nums">
              {line.qty}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              aria-label={`Tambah ${line.name}`}
              disabled={line.qty >= 99}
              onClick={() => onQtyChange(line.id, line.qty + 1)}
            >
              <Plus />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(line)}
            >
              <Pencil data-icon="inline-start" />
              Ubah
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-chili hover:text-chili size-8"
              aria-label={`Hapus ${line.name}`}
              onClick={() => onRemove(line.id)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
