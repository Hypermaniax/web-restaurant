import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminErrorState } from './admin-error-state'
import { EmptyState } from './empty-state'

interface ModifiersErrorProps {
  message: string
  onRetry: () => void
}

export function ModifiersError({ message, onRetry }: ModifiersErrorProps) {
  return (
    <AdminErrorState
      title="Modifier gagal dimuat"
      message={message}
      onRetry={onRetry}
    />
  )
}

interface ModifiersEmptyProps {
  onCreate: () => void
}

export function ModifiersEmpty({ onCreate }: ModifiersEmptyProps) {
  return (
    <EmptyState
      title="Belum ada modifier"
      description="Buat grup modifier pertama untuk pilihan tambahan di menu."
      action={
        <Button variant="accent" onClick={onCreate}>
          <Plus />
          Tambah grup
        </Button>
      }
    />
  )
}
