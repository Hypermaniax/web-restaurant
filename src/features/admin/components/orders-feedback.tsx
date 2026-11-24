import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminErrorState } from './admin-error-state'
import { DataTableSkeleton } from './data-table-skeleton'
import { EmptyState } from './empty-state'

export function OrdersLoading() {
  return (
    <DataTableSkeleton
      columns={[
        'Order',
        'Meja / tipe',
        'Status',
        'Pembayaran',
        'Total',
        'Aksi',
      ]}
      leading
    />
  )
}

interface OrdersErrorProps {
  message: string
  onRetry: () => void
}

export function OrdersError({ message, onRetry }: OrdersErrorProps) {
  return (
    <AdminErrorState
      title="Order gagal dimuat"
      message={message}
      onRetry={onRetry}
    />
  )
}

interface OrdersEmptyProps {
  hasFilters: boolean
  onReset: () => void
}

export function OrdersEmpty({ hasFilters, onReset }: OrdersEmptyProps) {
  return (
    <EmptyState
      title="Tidak ada order"
      description={
        hasFilters
          ? 'Tidak ada order yang cocok dengan filter. Coba hapus beberapa filter.'
          : 'Belum ada order pada outlet ini.'
      }
      action={
        hasFilters ? (
          <Button variant="outline" onClick={onReset}>
            <Search />
            Hapus filter
          </Button>
        ) : undefined
      }
    />
  )
}
