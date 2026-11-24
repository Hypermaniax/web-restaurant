import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
    <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6">
      <p className="text-destructive font-semibold">Ringkasan gagal dimuat</p>
      <p className="text-muted-foreground mt-1 text-sm">{message}</p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
  )
}
