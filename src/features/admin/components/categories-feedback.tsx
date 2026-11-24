import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminErrorState } from './admin-error-state'
import { DataTableSkeleton } from './data-table-skeleton'
import { EmptyState } from './empty-state'

export function CategoriesLoading() {
  return (
    <DataTableSkeleton
      columns={['Nama', 'Urutan', 'Status', 'Aksi']}
      rows={5}
    />
  )
}

interface CategoriesErrorProps {
  message: string
  onRetry: () => void
}

export function CategoriesError({ message, onRetry }: CategoriesErrorProps) {
  return (
    <AdminErrorState
      title="Kategori gagal dimuat"
      message={message}
      onRetry={onRetry}
    />
  )
}

interface CategoriesEmptyProps {
  onCreate: () => void
}

export function CategoriesEmpty({ onCreate }: CategoriesEmptyProps) {
  return (
    <EmptyState
      title="Belum ada kategori"
      description="Mulai dengan membuat kategori pertama untuk menyusun menu."
      action={
        <Button variant="accent" onClick={onCreate}>
          <Plus />
          Tambah kategori
        </Button>
      }
    />
  )
}
