import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CreatedOrder } from '../api/types'
import { PaymentOrderMeta } from './payment-order-meta'

interface PaymentExpiredProps {
  order: CreatedOrder
  tableName: string
  paymentState: string
  onBackToMenu: () => void
}

export function PaymentExpired({
  order,
  tableName,
  paymentState,
  onBackToMenu,
}: PaymentExpiredProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-4 pb-10 sm:px-8">
      <div className="border-chili/20 bg-card rounded-[2rem] border p-6 sm:p-9">
        <CircleAlert className="text-chili size-10" />
        <h1 className="font-display text-pine mt-5 text-4xl font-bold tracking-[-0.04em]">
          {paymentState === 'CANCELLED'
            ? 'Pesanan dibatalkan'
            : paymentState === 'FAILED'
              ? 'Pembayaran gagal'
              : 'Pesanan kedaluwarsa'}
        </h1>
        <p className="text-pine/60 mt-3 max-w-md text-sm leading-6">
          Pesanan {order.orderNumber} tidak bisa dilanjutkan dari halaman ini.
          Silakan pesan ulang, atau tanyakan ke kasir jika kamu sudah membayar.
        </p>

        <div className="mt-6">
          <PaymentOrderMeta order={order} tableName={tableName} />
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="accent"
            size="lg"
            onClick={onBackToMenu}
          >
            Kembali ke menu
          </Button>
        </div>
      </div>
    </div>
  )
}
