import { Plus, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminErrorState } from './admin-error-state'
import { EmptyState } from './empty-state'

interface TablesQrWarningProps {
  qrBaseUrl: string
}

export function TablesQrWarning({ qrBaseUrl }: TablesQrWarningProps) {
  return (
    <Alert className="border-marigold/40 bg-marigold/10">
      <TriangleAlert />
      <AlertTitle>QR masih memakai URL lokal</AlertTitle>
      <AlertDescription>
        `QR_BASE_URL` saat ini `{qrBaseUrl}`. Ganti ke domain publik atau tunnel
        sebelum mencetak QR untuk customer.
      </AlertDescription>
    </Alert>
  )
}

export function TablesLoading() {
  return (
    <div
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Memuat meja</span>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-card flex flex-col gap-4 rounded-2xl border p-5"
          aria-hidden
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mx-auto size-36 rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-xl" />
            <Skeleton className="h-9 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface TablesErrorProps {
  message: string
  onRetry: () => void
}

export function TablesError({ message, onRetry }: TablesErrorProps) {
  return (
    <AdminErrorState
      title="Meja gagal dimuat"
      message={message}
      onRetry={onRetry}
    />
  )
}

interface TablesEmptyProps {
  onCreate: () => void
}

export function TablesEmpty({ onCreate }: TablesEmptyProps) {
  return (
    <EmptyState
      title="Belum ada meja"
      description="Tambahkan meja pertama, lalu cetak QR untuk ditempel di meja."
      action={
        <Button variant="accent" onClick={onCreate}>
          <Plus />
          Tambah meja
        </Button>
      }
    />
  )
}
