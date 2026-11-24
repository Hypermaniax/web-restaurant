import { Ban } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Order } from '../api/orders-api'
import {
  canCancelOrder,
  getOrderSourceLabel,
  getOrderStatusClass,
  getOrderStatusLabel,
  getOrderTypeLabel,
  getPaymentStatusLabel,
} from '../lib/orders'
import { OrderDetailHistory } from './order-detail-history'
import { OrderDetailItems } from './order-detail-items'
import { OrderDetailOverview } from './order-detail-overview'

interface OrderDetailSheetProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: (order: Order) => void
}

export function OrderDetailSheet({
  order,
  open,
  onOpenChange,
  onCancel,
}: OrderDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        {order ? (
          <>
            <SheetHeader className="pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getOrderStatusClass(order.status)}>
                  {getOrderStatusLabel(order.status)}
                </Badge>
                <Badge variant="outline">
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Badge>
                <Badge variant="secondary">
                  {getOrderTypeLabel(order.orderType)}
                </Badge>
              </div>
              <SheetTitle className="font-display text-2xl">
                Order {order.orderNumber}
              </SheetTitle>
              <SheetDescription>
                {order.table
                  ? `Meja ${order.table.code} · ${order.table.name}`
                  : 'Takeaway'}{' '}
                · {getOrderSourceLabel(order.source)}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-4">
              <OrderDetailOverview order={order} />
              <OrderDetailItems order={order} />
              <OrderDetailHistory order={order} />
            </div>

            <SheetFooter className="border-pine/10 border-t">
              {canCancelOrder(order.status) ? (
                <Button variant="destructive" onClick={() => onCancel(order)}>
                  <Ban />
                  Batalkan order
                </Button>
              ) : null}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Tutup
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
