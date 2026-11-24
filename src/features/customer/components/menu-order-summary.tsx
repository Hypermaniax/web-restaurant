import { ChevronRight, ShoppingBag } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/format'
import type { QuoteTotals } from '../api/types'
import { PriceBreakdown } from './price-breakdown'

interface MenuOrderSummaryProps {
  cartCount: number
  hasLines: boolean
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  quoteError: string | null
  onOpenCart: () => void
}

export function MenuOrderSummary({
  cartCount,
  hasLines,
  quote,
  quoteLoading,
  quoteError,
  onOpenCart,
}: MenuOrderSummaryProps) {
  return (
    <aside className="hidden lg:block">
      <div className="border-pine/10 bg-card sticky top-24 rounded-2xl border p-5">
        <h2 className="font-display text-pine text-xl font-bold tracking-tight">
          Pesananmu
        </h2>
        <p className="text-pine/50 mt-1 text-xs">
          {cartCount > 0
            ? `${cartCount} item dipilih`
            : 'Belum ada item dipilih'}
        </p>

        <div className="mt-4">
          {quoteError ? (
            <Alert variant="destructive">
              <AlertTitle>Total belum bisa dihitung</AlertTitle>
              <AlertDescription>{quoteError}</AlertDescription>
            </Alert>
          ) : quoteLoading && hasLines ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-9 w-1/2 self-end" />
            </div>
          ) : quote ? (
            <PriceBreakdown quote={quote} compact />
          ) : (
            <p className="text-pine/50 text-sm leading-6">
              Pilih menu untuk melihat ringkasan dan total.
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="accent"
          size="lg"
          className="mt-5 w-full"
          disabled={!hasLines || quoteLoading || !quote}
          onClick={onOpenCart}
        >
          <ShoppingBag data-icon="inline-start" />
          Lihat pesanan
        </Button>
      </div>
    </aside>
  )
}

interface MobileCartBarProps {
  cartCount: number
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  onOpenCart: () => void
}

export function MobileCartBar({
  cartCount,
  quote,
  quoteLoading,
  onOpenCart,
}: MobileCartBarProps) {
  return (
    <div className="border-pine/10 bg-card/95 fixed inset-x-0 bottom-0 z-30 border-t pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-pine/45 text-xs">{cartCount} item</p>
          {quoteLoading ? (
            <Skeleton className="mt-1 h-6 w-28" />
          ) : (
            <p className="font-display text-pine text-lg font-bold tabular-nums">
              {quote ? formatCurrency(quote.total) : 'Lihat pesanan'}
            </p>
          )}
        </div>
        <Button type="button" variant="accent" size="lg" onClick={onOpenCart}>
          Lihat pesanan
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
