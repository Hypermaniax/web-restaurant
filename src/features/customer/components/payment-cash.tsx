import type { CreatedOrder } from '../api/types'
import { PaymentStatusRefresh } from './payment-status-refresh'

interface PaymentCashProps {
  order: CreatedOrder
  statusLoading: boolean
  statusError: string | null
  onRefreshStatus: () => void
}

export function PaymentCash({
  order,
  statusLoading,
  statusError,
  onRefreshStatus,
}: PaymentCashProps) {
  return (
    <div className="mt-6">
      <div className="border-pine/10 bg-rice/60 rounded-2xl border p-6 text-center">
        <p className="text-pine/50 text-xs font-medium">Nomor order</p>
        <p className="font-display text-pine mt-2 text-3xl font-bold tracking-[-0.04em] whitespace-nowrap tabular-nums sm:text-4xl">
          {order.orderNumber}
        </p>
        <p className="text-pine/60 mx-auto mt-3 max-w-sm text-sm leading-6">
          Tunjukkan nomor ini ke kasir. Setelah pembayaran dikonfirmasi, nomor
          antrian akan muncul di halaman ini.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-pine/55 flex items-center gap-2 text-sm">
          <span className="bg-marigold size-2 animate-pulse rounded-full" />
          Menunggu konfirmasi kasir
        </div>
        <PaymentStatusRefresh
          loading={statusLoading}
          error={statusError}
          onRefresh={onRefreshStatus}
        />
      </div>
    </div>
  )
}
