import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminErrorState } from './admin-error-state'
import { DataTableSkeleton } from './data-table-skeleton'
import { EmptyState } from './empty-state'

export function StaffLoading() {
  return (
    <DataTableSkeleton
      columns={['Staff', 'Role', 'Status', 'Login terakhir', 'Aksi']}
      rows={5}
      leading
    />
  )
}

interface StaffErrorProps {
  message: string
  onRetry: () => void
}

export function StaffError({ message, onRetry }: StaffErrorProps) {
  return (
    <AdminErrorState
      title="Staff gagal dimuat"
      message={message}
      onRetry={onRetry}
    />
  )
}

interface StaffEmptyProps {
  onCreate: () => void
}

export function StaffEmpty({ onCreate }: StaffEmptyProps) {
  return (
    <EmptyState
      title="Belum ada staff"
      description="Tambahkan akun kasir atau kitchen untuk mulai beroperasi."
      action={
        <Button variant="accent" onClick={onCreate}>
          <Plus />
          Tambah staff
        </Button>
      }
    />
  )
}
