import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { SheetFooter } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { QuoteTotals } from '../api/types'
import { PriceBreakdown } from './price-breakdown'

interface CartSummaryProps {
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  quoteError: string | null
  onCheckout: () => void
  onRetryQuote: () => void
}

export function CartSummary({
  quote,
  quoteLoading,
  quoteError,
  onCheckout,
  onRetryQuote,
}: CartSummaryProps) {
  return (
    <SheetFooter className="border-pine/10 bg-card/95 border-t p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur">
      <div className="flex w-full flex-col gap-4">
        {quoteError ? (
          <Alert variant="destructive">
            <AlertTitle>Ringkasan belum bisa dihitung</AlertTitle>
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
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-9 w-1/2 self-end" />
          </div>
        ) : quote ? (
          <PriceBreakdown quote={quote} compact />
        ) : null}

        <Button
          type="button"
          variant="accent"
          size="lg"
          className="w-full"
          disabled={quoteLoading || !quote || Boolean(quoteError)}
          onClick={onCheckout}
        >
          Lanjut ke pembayaran
        </Button>
        <p className="text-pine/45 text-center text-xs">
          Total final dihitung ulang oleh server saat pesanan dibuat.
        </p>
      </div>
    </SheetFooter>
  )
}
