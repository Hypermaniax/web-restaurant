import { ShieldCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import type { PaymentMethod, QuoteTotals } from '../api/types'

interface CheckoutSubmitProps {
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  paymentMethod: PaymentMethod
  submitting: boolean
  submitError: string | null
}

export function CheckoutSubmit({
  quote,
  quoteLoading,
  paymentMethod,
  submitting,
  submitError,
}: CheckoutSubmitProps) {
  return (
    <>
      {submitError ? (
        <Alert variant="destructive">
          <AlertTitle>Pesanan belum berhasil dibuat</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full"
          disabled={submitting || quoteLoading || !quote}
        >
          {submitting
            ? 'Membuat pesanan…'
            : quote
              ? `Buat pesanan · ${paymentMethod === 'QRIS' ? 'QRIS' : 'Tunai'} · ${formatCurrency(quote.total)}`
              : 'Buat pesanan'}
        </Button>
        <p className="text-pine/45 flex items-start gap-2 text-xs leading-5">
          <ShieldCheck className="text-pine/40 mt-0.5 size-4 shrink-0" />
          Pesanan diproses setelah pembayaran. Tidak ada pembatalan otomatis
          dari halaman ini.
        </p>
      </div>
    </>
  )
}
