import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6">
      <p className="text-destructive font-semibold">Kategori gagal dimuat</p>
      <p className="text-muted-foreground mt-1 text-sm">{message}</p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
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
