import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '../page-header'
import { ReportMetricsLoading } from '../report-metrics-loading'
import { todayJakarta } from '../../lib/reports'

export function ReportsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operasional"
        title="Laporan"
        description="Omzet, pembayaran, pajak, pembatalan, dan item terlaris dari data yang sudah dibayar."
        actions={
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="report-date" className="text-xs">
                Tanggal bisnis
              </Label>
              <Input
                id="report-date"
                type="date"
                value={todayJakarta()}
                disabled
                className="w-40"
              />
            </div>
            <Button variant="outline" disabled>
              Hari ini
            </Button>
            <div className="flex flex-col gap-1">
              <Label htmlFor="report-export" className="text-xs">
                Jenis CSV
              </Label>
              <Button id="report-export" variant="outline" disabled>
                Ringkasan harian
              </Button>
            </div>
            <Button variant="accent" disabled>
              <Download />
              Export CSV
            </Button>
          </div>
        }
      />
      <ReportMetricsLoading />
      <div className="flex gap-2 overflow-hidden">
        {[
          'Ringkasan',
          'Pembayaran',
          'Pajak',
          'Pembatalan',
          'Item terlaris',
        ].map((label) => (
          <SkeletonTab key={label} label={label} />
        ))}
      </div>
      <SkeletonTableArea />
    </div>
  )
}

function SkeletonTab({ label }: { label: string }) {
  return (
    <div className="bg-muted flex h-9 shrink-0 items-center rounded-lg px-4 text-sm font-medium">
      {label}
    </div>
  )
}

function SkeletonTableArea() {
  return <div className="bg-card h-80 rounded-2xl border" aria-hidden />
}
