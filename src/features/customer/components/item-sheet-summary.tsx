import { assetUrl } from '@/lib/assets'
import { formatCurrency } from '@/lib/format'
import type { PublicMenuItem } from '../api/types'

interface ItemSheetSummaryProps {
  item: PublicMenuItem
}

export function ItemSheetSummary({ item }: ItemSheetSummaryProps) {
  return (
    <>
      {item.imageUrl ? (
        <img
          src={assetUrl(item.imageUrl) ?? undefined}
          alt={item.name}
          className="bg-mint aspect-[16/9] w-full rounded-2xl object-cover"
        />
      ) : null}

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-pine/50 text-xs font-medium">Harga menu</p>
          <p className="font-display text-pine mt-1 text-2xl font-bold tracking-tight tabular-nums">
            {formatCurrency(item.price)}
          </p>
        </div>
        <p className="text-pine/55 max-w-40 text-right text-xs leading-5">
          Total akhir dihitung server setelah semua pilihan masuk.
        </p>
      </div>
    </>
  )
}
