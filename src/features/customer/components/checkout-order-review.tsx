import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { QuoteTotals } from '../api/types'
import type { CartLine } from '../stores/cart-store'
import { PriceBreakdown } from './price-breakdown'

interface CheckoutOrderReviewProps {
  tableName: string
  lines: CartLine[]
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  quoteError: string | null
  onRetryQuote: () => void
}

export function CheckoutOrderReview({
  tableName,
  lines,
  quote,
  quoteLoading,
  quoteError,
  onRetryQuote,
}: CheckoutOrderReviewProps) {
  return (
    <section>
      <h1 className="font-display text-pine text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
        Periksa pesanan
      </h1>
      <p className="text-pine/60 mt-3 text-sm leading-6">
        Pesanan untuk {tableName}. Pastikan item dan jumlahnya sudah sesuai.
      </p>

      <div className="divide-pine/10 mt-7 flex flex-col divide-y">
        {lines.map((line) => (
          <div key={line.id} className="flex gap-3 py-4 first:pt-0">
            <span className="bg-mint text-pine grid size-10 shrink-0 place-items-center rounded-xl text-sm font-semibold">
              {line.qty}×
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-pine text-sm font-semibold">{line.name}</p>
              {line.modifiers.length > 0 ? (
                <p className="text-pine/55 mt-1 text-xs leading-5">
                  {line.modifiers.map((modifier) => modifier.name).join(' · ')}
                </p>
              ) : null}
              {line.notes ? (
                <p className="text-chili mt-1 text-xs leading-5">
                  Catatan: {line.notes}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="border-pine/10 mt-4 border-t pt-5">
        {quoteError ? (
          <Alert variant="destructive">
            <AlertTitle>Total belum bisa dihitung</AlertTitle>
            <AlertDescription>
              <p>{quoteError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onRetryQuote}
              >
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        ) : quoteLoading ? (
          <div className="flex flex-col gap-2" role="status" aria-busy="true">
            <span className="sr-only">Menghitung total</span>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-8 w-1/2 self-end" />
          </div>
        ) : quote ? (
          <PriceBreakdown quote={quote} />
        ) : (
          <p className="text-pine/55 text-sm">
            Total akan muncul setelah menu dipilih.
          </p>
        )}
      </div>
    </section>
  )
}
