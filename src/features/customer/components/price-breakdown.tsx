import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'
import type { QuoteTotals } from '../api/types'
import { formatRateBp } from '../lib/cart'

interface PriceBreakdownProps {
  quote: QuoteTotals
  compact?: boolean
}

export function PriceBreakdown({
  quote,
  compact = false,
}: PriceBreakdownProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-pine/70 flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span>Subtotal</span>
          <span className="text-pine font-medium tabular-nums">
            {formatCurrency(quote.subtotal)}
          </span>
        </div>
        {quote.discountAmount > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span>Diskon</span>
            <span className="text-chili font-medium tabular-nums">
              −{formatCurrency(quote.discountAmount)}
            </span>
          </div>
        ) : null}
        {quote.serviceAmount > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span>Service {formatRateBp(quote.serviceRateBp)}</span>
            <span className="text-pine font-medium tabular-nums">
              {formatCurrency(quote.serviceAmount)}
            </span>
          </div>
        ) : null}
        {quote.taxAmount > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span>
              Pajak {formatRateBp(quote.taxRateBp)}
              {quote.taxInclusive ? ' (termasuk)' : ''}
            </span>
            <span className="text-pine font-medium tabular-nums">
              {formatCurrency(quote.taxAmount)}
            </span>
          </div>
        ) : null}
      </div>

      <Separator />

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-pine/50 text-xs font-medium">Total</p>
          <p className="text-pine/55 mt-1 max-w-56 text-xs leading-5">
            {quote.taxInclusive
              ? 'Harga menu sudah termasuk pajak.'
              : quote.taxAmount > 0
                ? 'Pajak ditambahkan ke total.'
                : 'Tidak ada pajak tambahan.'}
          </p>
        </div>
        <p
          className={
            compact
              ? 'font-display text-pine text-2xl font-bold tracking-tight tabular-nums'
              : 'font-display text-pine text-3xl font-bold tracking-tight tabular-nums'
          }
        >
          {formatCurrency(quote.total)}
        </p>
      </div>
    </div>
  )
}
