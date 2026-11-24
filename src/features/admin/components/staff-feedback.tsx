import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6">
      <p className="text-destructive font-semibold">Staff gagal dimuat</p>
      <p className="text-muted-foreground mt-1 text-sm">{message}</p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
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
