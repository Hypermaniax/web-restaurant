import { formatCurrency } from '@/lib/format'
import type { CreatedOrder } from '../api/types'

interface PaymentOrderMetaProps {
  order: CreatedOrder
  tableName: string
}

export function PaymentOrderMeta({ order, tableName }: PaymentOrderMetaProps) {
  return (
    <div className="border-pine/10 bg-rice/60 grid grid-cols-2 gap-3 rounded-2xl border p-4 text-sm sm:grid-cols-3">
      <div>
        <p className="text-pine/45 text-xs">Meja</p>
        <p className="text-pine mt-1 font-semibold">{tableName}</p>
      </div>
      <div>
        <p className="text-pine/45 text-xs">Nomor order</p>
        <p className="text-pine mt-1 font-semibold tabular-nums">
          {order.orderNumber}
        </p>
      </div>
      <div>
        <p className="text-pine/45 text-xs">Total</p>
        <p className="text-pine mt-1 font-semibold tabular-nums">
          {formatCurrency(order.total)}
        </p>
      </div>
    </div>
  )
}
