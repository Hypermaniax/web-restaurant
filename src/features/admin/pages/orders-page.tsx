import { useMemo, useState } from 'react'
import { useCashierTables } from '../api/admin-api'
import {
  useCancelOrder,
  useOrders,
  type Order,
  type OrderFilters,
} from '../api/orders-api'
import { CancelOrderDialog } from '../components/cancel-order-dialog'
import { OrderDetailSheet } from '../components/order-detail-sheet'
import { OrderFilterCard } from '../components/order-filter-card'
import { OrderTable } from '../components/order-table'
import { Pagination } from '../components/pagination'
import {
  OrdersEmpty,
  OrdersError,
  OrdersLoading,
} from '../components/orders-feedback'
import { OrdersHeader } from '../components/orders-header'
import { useCashierRealtime } from '../hooks/use-cashier-realtime'
import { getErrorMessage } from '../lib/errors'
import { usePagination } from '../hooks/use-pagination'

export function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({})
  const { page, pageSize, resetPage, paginationProps } = usePagination()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)
  const connected = useCashierRealtime()
  const orders = useOrders(filters, page, pageSize)
  const tables = useCashierTables()
  const cancelOrder = useCancelOrder()

  const selectedOrder = useMemo(
    () => orders.data?.items.find((order) => order.id === selectedId) ?? null,
    [orders.data, selectedId],
  )

  const hasFilters = Object.keys(filters).length > 0

  function updateFilters(nextFilters: OrderFilters) {
    setFilters(nextFilters)
    resetPage()
  }

  function resetFilters() {
    setFilters({})
    resetPage()
  }

  function confirmCancel(reason: string) {
    if (!cancelTarget) return

    cancelOrder.mutate(
      { id: cancelTarget.id, reason },
      {
        onSuccess: () => {
          setCancelTarget(null)
          setSelectedId(null)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <OrdersHeader
        connected={connected}
        isFetching={orders.isFetching}
        onRefresh={() => void orders.refetch()}
      />

      <OrderFilterCard
        filters={filters}
        tables={tables.data ?? []}
        hasFilters={hasFilters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />

      {orders.isLoading ? (
        <OrdersLoading />
      ) : orders.isError ? (
        <OrdersError
          message={getErrorMessage(orders.error)}
          onRetry={() => void orders.refetch()}
        />
      ) : orders.data && orders.data.meta.total > 0 ? (
        <>
          {orders.data.items.length > 0 ? (
            <OrderTable
              orders={orders.data.items}
              onDetail={(order) => setSelectedId(order.id)}
              onCancel={setCancelTarget}
            />
          ) : null}
          <Pagination meta={orders.data.meta} {...paginationProps} />
        </>
      ) : (
        <OrdersEmpty hasFilters={hasFilters} onReset={resetFilters} />
      )}

      <OrderDetailSheet
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        onCancel={setCancelTarget}
      />

      <CancelOrderDialog
        order={cancelTarget}
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null)
        }}
        onConfirm={confirmCancel}
        isPending={cancelOrder.isPending}
      />
    </div>
  )
}
