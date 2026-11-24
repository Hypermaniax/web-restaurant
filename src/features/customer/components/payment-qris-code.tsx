import { QRCodeSVG } from 'qrcode.react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/format'
import type { QrisPayment } from '../api/types'
import { formatCountdown } from '../lib/payment'

interface PaymentQrisCodeProps {
  preparing: boolean
  paymentError: string | null
  qris: QrisPayment | null
  remainingMs: number
  qrisExpired: boolean
}

export function PaymentQrisCode({
  preparing,
  paymentError,
  qris,
  remainingMs,
  qrisExpired,
}: PaymentQrisCodeProps) {
  if (preparing) {
    return <QrisSkeleton />
  }

  if (paymentError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>QRIS belum bisa dibuat</AlertTitle>
        <AlertDescription>
          <p>{paymentError}</p>
          <p className="text-pine/60 mt-2">
            Kamu bisa mencoba QRIS lagi atau bayar tunai di kasir dengan nomor
            order yang sama.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  if (!qris) {
    return <QrisSkeleton />
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="border-pine/10 rounded-2xl border bg-white p-3">
        <QRCodeSVG
          value={qris.qrString}
          size={200}
          level="M"
          marginSize={2}
          title="QRIS pembayaran"
          className="h-auto w-full max-w-[200px]"
        />
      </div>

      <div className="text-center">
        <p className="text-pine/50 text-xs font-medium">Sisa waktu bayar</p>
        <p
          className={
            qrisExpired
              ? 'font-display text-chili mt-1 text-3xl font-bold tabular-nums'
              : 'font-display text-pine mt-1 text-3xl font-bold tabular-nums'
          }
        >
          {formatCountdown(remainingMs)}
        </p>
        <p className="text-pine/55 mt-2 text-sm">
          {formatCurrency(qris.amount)}
        </p>
      </div>

      {qrisExpired ? (
        <Alert variant="destructive">
          <AlertTitle>QR kedaluwarsa</AlertTitle>
          <AlertDescription>
            Coba buat QR baru, atau pilih bayar tunai di kasir.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

function QrisSkeleton() {
  return (
    <div
      className="border-pine/10 flex flex-col items-center gap-5 rounded-2xl border p-6"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Menyiapkan QRIS</span>
      <Skeleton className="size-52 rounded-2xl" />
      <div className="flex w-full max-w-48 flex-col items-center gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}
