import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const metricLabels = ['Omzet', 'Order', 'Pajak', 'Service', 'Diskon']

export function ReportMetricsLoading() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Memuat ringkasan laporan</span>
      {metricLabels.map((label) => (
        <Card key={label} className="gap-2" aria-hidden>
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <Skeleton className="h-8 w-28" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
