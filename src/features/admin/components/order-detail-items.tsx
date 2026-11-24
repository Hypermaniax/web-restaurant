import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'
import type { Order } from '../api/orders-api'

interface OrderDetailItemsProps {
  order: Order
}

export function OrderDetailItems({ order }: OrderDetailItemsProps) {
  return (
    <>
      <section>
        <h3 className="font-display text-pine text-lg font-bold">Item</h3>
        <div className="mt-3 flex flex-col gap-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border-pine/10 bg-card rounded-xl border p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {item.qty}× {item.nameSnapshot}
                  </p>
                  {item.modifiers.length > 0 ? (
                    <ul className="text-muted-foreground mt-1 text-sm">
                      {item.modifiers.map((modifier) => (
                        <li key={modifier.id}>
                          + {modifier.nameSnapshot}
                          {modifier.priceDelta > 0
                            ? ` (${formatCurrency(modifier.priceDelta)})`
                            : ''}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.notes ? (
                    <p className="text-muted-foreground mt-1 text-sm italic">
                      “{item.notes}”
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 text-sm font-semibold">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-pine/10 bg-card rounded-xl border p-4 text-sm">
        <h3 className="font-display text-pine mb-3 text-lg font-bold">
          Ringkasan
        </h3>
        <div className="flex flex-col gap-2">
          <SummaryRow label="Subtotal" value={order.subtotal} />
          {order.serviceAmount > 0 ? (
            <SummaryRow
              label={`Service (${(order.serviceRateBp / 100).toFixed(2)}%)`}
              value={order.serviceAmount}
            />
          ) : null}
          <SummaryRow
            label={`Pajak (${(order.taxRateBp / 100).toFixed(2)}%)`}
            value={order.taxAmount}
          />
          {order.discountAmount > 0 ? (
            <SummaryRow label="Diskon" value={-order.discountAmount} />
          ) : null}
          <Separator />
          <div className="text-pine flex items-center justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            {order.taxInclusive
              ? 'Harga sudah termasuk pajak.'
              : 'Harga belum termasuk pajak.'}
          </p>
        </div>
      </section>
    </>
  )
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-muted-foreground flex items-center justify-between">
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  )
}
