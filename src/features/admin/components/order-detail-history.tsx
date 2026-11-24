import { formatCurrency, formatDateTime } from '@/lib/format'
import type { Order } from '../api/orders-api'
import { getPaymentMethodLabel, getPaymentStatusLabel } from '../lib/orders'

interface OrderDetailHistoryProps {
  order: Order
}

export function OrderDetailHistory({ order }: OrderDetailHistoryProps) {
  const timeline = [
    { label: 'Order dibuat', value: order.createdAt },
    { label: 'Pembayaran', value: order.paidAt },
    { label: 'Mulai disiapkan', value: order.preparingAt },
    { label: 'Siap diambil', value: order.readyAt },
    { label: 'Disajikan', value: order.servedAt },
    { label: 'Dibatalkan', value: order.cancelledAt },
  ].filter((item) => item.value !== null)

  return (
    <>
      {order.payments.length > 0 ? (
        <section>
          <h3 className="font-display text-pine text-lg font-bold">
            Pembayaran
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {order.payments.map((payment) => (
              <div
                key={payment.id}
                className="border-pine/10 bg-card flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold">
                    {getPaymentMethodLabel(payment.method)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {payment.provider} · {getPaymentStatusLabel(payment.status)}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h3 className="font-display text-pine text-lg font-bold">Timeline</h3>
        <ol className="border-pine/15 mt-3 flex flex-col gap-3 border-l pl-4">
          {timeline.map((item) => (
            <li key={item.label} className="relative">
              <span className="bg-marigold absolute top-1.5 -left-[21px] size-2.5 rounded-full" />
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-muted-foreground text-xs">
                {item.value ? formatDateTime(item.value) : '-'}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {order.cancelReason ? (
        <div className="border-chili/20 bg-chili/5 rounded-xl border px-4 py-3 text-sm">
          <p className="text-chili font-semibold">Alasan pembatalan</p>
          <p className="mt-1">{order.cancelReason}</p>
        </div>
      ) : null}
    </>
  )
}
