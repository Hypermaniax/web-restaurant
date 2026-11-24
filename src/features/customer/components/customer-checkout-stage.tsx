import type { QuoteTotals } from '../api/types'
import type { CustomerOrderController } from '../hooks/use-customer-order'
import type { CartLine } from '../stores/cart-store'
import { CheckoutPanel } from './checkout-panel'
import { CustomerStageShell } from './customer-stage-shell'

interface CustomerCheckoutStageProps {
  tableName: string
  cartCount: number
  lines: CartLine[]
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  quoteError: string | null
  controller: CustomerOrderController
  onRetryQuote: () => void
}

export function CustomerCheckoutStage({
  tableName,
  cartCount,
  lines,
  quote,
  quoteLoading,
  quoteError,
  controller,
  onRetryQuote,
}: CustomerCheckoutStageProps) {
  return (
    <CustomerStageShell tableName={tableName} cartCount={cartCount}>
      <CheckoutPanel
        tableName={tableName}
        lines={lines}
        quote={quote}
        quoteLoading={quoteLoading}
        quoteError={quoteError}
        submitting={controller.submitting}
        submitError={controller.submitError}
        onBack={controller.backToMenu}
        onSubmit={controller.submitCheckout}
        onRetryQuote={onRetryQuote}
      />
    </CustomerStageShell>
  )
}
