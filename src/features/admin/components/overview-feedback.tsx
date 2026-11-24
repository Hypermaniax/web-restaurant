import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminErrorState } from './admin-error-state'

const statLabels = [
  'Omzet hari ini',
  'Meja terbuka',
  'Pembayaran tertunda',
  'Antrian dapur',
]

export function OverviewLoading() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Memuat ringkasan</span>
      {statLabels.map((label) => (
        <Card key={label} className="gap-2 py-5" aria-hidden>
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <Skeleton className="h-8 w-28" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

interface OverviewErrorProps {
  message: string
  onRetry: () => void
}

export function OverviewError({ message, onRetry }: OverviewErrorProps) {
  return (
    <AdminErrorState
      title="Ringkasan gagal dimuat"
      message={message}
      onRetry={onRetry}
    />
  )
}
