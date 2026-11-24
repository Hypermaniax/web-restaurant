import { Clock3, ReceiptText } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import type { Order } from '../api/orders-api'
import { getPaymentMethodLabel } from '../lib/orders'

interface OrderDetailOverviewProps {
  order: Order
}

export function OrderDetailOverview({ order }: OrderDetailOverviewProps) {
  return (
    <>
      {order.queueDisplay ? (
        <div className="bg-pine text-rice flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
          <div>
            <p className="text-rice/60 text-xs font-semibold tracking-[0.16em] uppercase">
              Nomor antrian
            </p>
            <p className="font-display mt-1 text-4xl font-bold tracking-[-0.04em]">
              {order.queueDisplay}
            </p>
          </div>
          <ReceiptText className="text-marigold size-8" />
        </div>
      ) : (
        <div className="border-border bg-muted/35 text-muted-foreground flex items-center gap-3 rounded-2xl border border-dashed px-4 py-3 text-sm">
          <Clock3 className="size-4 shrink-0" />
          Nomor antrian diberikan setelah pembayaran dikonfirmasi.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="Pelanggan" value={order.customerName ?? '-'} />
        <Info
          label="Pembayaran"
          value={
            order.payments[0]
              ? getPaymentMethodLabel(order.payments[0].method)
              : '-'
          }
        />
        <Info label="Dibuat" value={formatDateTime(order.createdAt)} />
        <Info label="Kedaluwarsa" value={formatDateTime(order.expiresAt)} />
      </div>

      {order.notes ? (
        <div className="border-marigold/30 bg-marigold/10 rounded-xl border px-4 py-3 text-sm">
          <p className="text-pine font-semibold">Catatan order</p>
          <p className="text-pine/75 mt-1">{order.notes}</p>
        </div>
      ) : null}
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  )
}
