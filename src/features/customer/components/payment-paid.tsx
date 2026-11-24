import { BadgeCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { CreatedOrder } from '../api/types'
import { PaymentOrderMeta } from './payment-order-meta'

interface PaymentPaidProps {
  order: CreatedOrder
  tableName: string
  queueDisplay: string | null
  onBackToMenu: () => void
}

export function PaymentPaid({
  order,
  tableName,
  queueDisplay,
  onBackToMenu,
}: PaymentPaidProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-4 pb-10 sm:px-8">
      <div className="border-pine/10 bg-card shadow-pine/10 rounded-[2rem] border p-6 shadow-2xl sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-mint text-pine border-mint gap-1.5">
              <BadgeCheck className="size-3.5" />
              Lunas
            </Badge>
            <Badge variant="outline">Dine-in</Badge>
          </div>
          <span className="text-pine/45 text-xs font-medium tabular-nums">
            {order.orderNumber}
          </span>
        </div>

        <p className="text-pine/55 mt-8 text-sm font-medium">Nomor antrian</p>
        <p
          className="font-display text-pine mt-1 text-7xl font-bold tracking-[-0.06em] tabular-nums sm:text-8xl"
          aria-live="polite"
        >
          {queueDisplay ?? '—'}
        </p>

        <p className="text-pine mt-5 text-lg font-semibold">
          Pembayaran diterima.
        </p>
        <p className="text-pine/60 mt-2 max-w-md text-sm leading-6">
          Tetap di {tableName}. Pesanan akan disiapkan dan diantar setelah nomor
          antrian dipanggil. Simpan nomor order ini jika perlu bantuan.
        </p>

        <Separator className="my-6" />

        <div className="flex flex-col gap-4">
          <PaymentOrderMeta order={order} tableName={tableName} />
          <Button
            type="button"
            variant="accent"
            size="lg"
            onClick={onBackToMenu}
          >
            Pesan lagi
          </Button>
          <p className="text-pine/45 text-center text-xs leading-5">
            Halaman ini bukan halaman pelacakan. Kalau halaman ditutup, scan QR
            meja lagi atau tanya kasir.
          </p>
        </div>
      </div>
    </div>
  )
}
