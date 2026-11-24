import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableSkeleton } from './data-table-skeleton'
import { EmptyState } from './empty-state'

export function MenuLoading() {
  return (
    <DataTableSkeleton
      columns={['Menu', 'Kategori', 'Harga', 'Tersedia', 'Status', 'Aksi']}
      leading
    />
  )
}

interface MenuEmptyStateProps {
  onCreate: () => void
}

export function MenuEmptyState({ onCreate }: MenuEmptyStateProps) {
  return (
    <EmptyState
      title="Belum ada menu"
      description="Tambahkan menu pertama, lengkapi harga, foto, dan modifier bila perlu."
      action={
        <Button variant="accent" onClick={onCreate}>
          <Plus />
          Tambah menu
        </Button>
      }
    />
  )
}
