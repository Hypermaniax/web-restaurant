import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6">
      <p className="text-destructive font-semibold">Order gagal dimuat</p>
      <p className="text-muted-foreground mt-1 text-sm">{message}</p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
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
