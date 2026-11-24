import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import type { QuoteTotals } from '../api/types'
import type { CartLine } from '../stores/cart-store'
import { checkoutSchema, type CheckoutFormValues } from '../lib/checkout-form'

import { CheckoutCustomerFields } from './checkout-customer-fields'
import { CheckoutOrderReview } from './checkout-order-review'
import { CheckoutPaymentMethods } from './checkout-payment-methods'
import { CheckoutSubmit } from './checkout-submit'

export type { CheckoutFormValues }

interface CheckoutPanelProps {
  tableName: string
  lines: CartLine[]
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  quoteError: string | null
  submitting: boolean
  submitError: string | null
  onBack: () => void
  onSubmit: (values: CheckoutFormValues) => void
  onRetryQuote: () => void
}

export function CheckoutPanel({
  tableName,
  lines,
  quote,
  quoteLoading,
  quoteError,
  submitting,
  submitError,
  onBack,
  onSubmit,
  onRetryQuote,
}: CheckoutPanelProps) {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      notes: '',
      paymentMethod: 'QRIS',
    },
  })
  const paymentMethod = useWatch({
    control: form.control,
    name: 'paymentMethod',
  })

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-4 pb-10 sm:px-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        disabled={submitting}
      >
        <ArrowLeft data-icon="inline-start" />
        Kembali ke menu
      </Button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <CheckoutOrderReview
          tableName={tableName}
          lines={lines}
          quote={quote}
          quoteLoading={quoteLoading}
          quoteError={quoteError}
          onRetryQuote={onRetryQuote}
        />

        <section>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <CheckoutCustomerFields form={form} />
            <CheckoutPaymentMethods form={form} />
            <CheckoutSubmit
              quote={quote}
              quoteLoading={quoteLoading}
              paymentMethod={paymentMethod}
              submitting={submitting}
              submitError={submitError}
            />
          </form>
        </section>
      </div>
    </div>
  )
}
