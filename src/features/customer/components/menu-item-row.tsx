import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { assetUrl } from '@/lib/assets'
import { formatCurrency } from '@/lib/format'
import type { PublicMenuItem } from '../api/types'

interface MenuItemRowProps {
  item: PublicMenuItem
  onSelect: (item: PublicMenuItem) => void
}

export function MenuItemRow({ item, onSelect }: MenuItemRowProps) {
  const image = assetUrl(item.imageUrl)

  return (
    <button
      type="button"
      disabled={!item.isAvailable}
      onClick={() => onSelect(item)}
      className="group hover:bg-card/60 focus-visible:ring-ring/50 flex w-full gap-4 py-4 text-left transition focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      <div className="bg-mint text-pine/30 grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl text-3xl font-semibold">
        {image ? (
          <img
            src={image}
            alt={item.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          item.name.slice(0, 1).toUpperCase()
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-pine text-lg leading-tight font-bold tracking-tight">
            {item.name}
          </h3>
          <p className="text-pine shrink-0 text-sm font-semibold tabular-nums">
            {formatCurrency(item.price)}
          </p>
        </div>

        {item.description ? (
          <p className="text-pine/55 mt-1 line-clamp-2 text-sm leading-5">
            {item.description}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!item.isAvailable ? (
              <Badge variant="secondary">Habis</Badge>
            ) : null}
            {item.modifierGroups.length > 0 ? (
              <span className="text-pine/45 text-xs">Bisa pilih tambahan</span>
            ) : null}
          </div>
          <span className="text-pine/45 flex items-center gap-1 text-xs font-medium">
            {item.isAvailable ? 'Pilih' : 'Tidak tersedia'}
            <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </button>
  )
}
