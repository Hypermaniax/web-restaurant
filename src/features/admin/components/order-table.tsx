import { Ban, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDateTime } from '@/lib/format'
import type { Order } from '../api/orders-api'
import {
  canCancelOrder,
  getOrderSourceLabel,
  getOrderStatusClass,
  getOrderStatusLabel,
  getOrderTypeLabel,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
} from '../lib/orders'

interface OrderTableProps {
  orders: Order[]
  onDetail: (order: Order) => void
  onCancel: (order: Order) => void
}

export function OrderTable({ orders, onDetail, onCancel }: OrderTableProps) {
  return (
    <div className="border-pine/10 bg-card overflow-hidden rounded-2xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Meja / tipe</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-28 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{order.orderNumber}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(order.createdAt)} ·{' '}
                    {getOrderSourceLabel(order.source)}
                  </span>
                  {order.queueDisplay ? (
                    <span className="text-pine text-xs font-semibold">
                      Antrian {order.queueDisplay}
                    </span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {order.table ? (
                      <>
                        {order.table.code}{' '}
                        <span className="text-muted-foreground">
                          · {order.table.name}
                        </span>
                      </>
                    ) : (
                      'Takeaway'
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {getOrderTypeLabel(order.orderType)}
                    {order.customerName ? ` · ${order.customerName}` : ''}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getOrderStatusClass(order.status)}>
                  {getOrderStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {order.payments[0]
                      ? getPaymentMethodLabel(order.payments[0].method)
                      : '-'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(order.total)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Detail ${order.orderNumber}`}
                    onClick={() => onDetail(order)}
                  >
                    <Eye />
                  </Button>
                  {canCancelOrder(order.status) ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      aria-label={`Batalkan ${order.orderNumber}`}
                      onClick={() => onCancel(order)}
                    >
                      <Ban />
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
