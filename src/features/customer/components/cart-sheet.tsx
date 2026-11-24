import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { QuoteTotals } from '../api/types'
import type { CartLine } from '../stores/cart-store'
import { CartEmptyState } from './cart-empty-state'
import { CartLineItem } from './cart-line-item'
import { CartSummary } from './cart-summary'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tableName: string
  lines: CartLine[]
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  quoteError: string | null
  onEdit: (line: CartLine) => void
  onRemove: (lineId: string) => void
  onQtyChange: (lineId: string, qty: number) => void
  onCheckout: () => void
  onRetryQuote: () => void
}

export function CartSheet({
  open,
  onOpenChange,
  tableName,
  lines,
  quote,
  quoteLoading,
  quoteError,
  onEdit,
  onRemove,
  onQtyChange,
  onCheckout,
  onRetryQuote,
}: CartSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92svh] flex-col gap-0 p-0 sm:max-w-xl sm:rounded-t-[2rem]"
      >
        <SheetHeader className="border-pine/10 border-b p-5 pr-14">
          <SheetTitle className="font-display text-2xl tracking-tight">
            Pesananmu
          </SheetTitle>
          <SheetDescription className="text-pine/60">
            {tableName} · {lines.length} jenis menu
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <CartEmptyState onClose={() => onOpenChange(false)} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="divide-pine/10 flex flex-col divide-y">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    onEdit={onEdit}
                    onRemove={onRemove}
                    onQtyChange={onQtyChange}
                  />
                ))}
              </div>
            </div>

            <CartSummary
              quote={quote}
              quoteLoading={quoteLoading}
              quoteError={quoteError}
              onCheckout={onCheckout}
              onRetryQuote={onRetryQuote}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
