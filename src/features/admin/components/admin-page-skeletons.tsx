import { Download, Plus, RefreshCw, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableSkeleton } from './data-table-skeleton'
import { ModifiersLoading } from './modifiers-loading'
import { PageHeader } from './page-header'
import { ReportMetricsLoading } from './report-metrics-loading'
import { TablesLoading } from './tables-feedback'
import { todayJakarta } from '../lib/reports'

interface TablePageSkeletonProps {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  columns: string[]
  rows?: number
  leading?: boolean
}

export function TablePageSkeleton({
  eyebrow,
  title,
  description,
  actionLabel,
  columns,
  rows,
  leading,
}: TablePageSkeletonProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Button variant="accent" disabled>
            <Plus />
            {actionLabel}
          </Button>
        }
      />
      <DataTableSkeleton columns={columns} rows={rows} leading={leading} />
    </div>
  )
}

export function OrdersPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operasional"
        title="Order monitor"
        description="Pantau order, pembayaran, dan antrian. Hanya order yang belum dibayar yang bisa dibatalkan."
        actions={
          <>
            <Badge
              variant="outline"
              className="border-pine/15 bg-card text-muted-foreground h-9 gap-2 px-3"
            >
              <WifiOff />
              Polling 15 detik
            </Badge>
            <Button variant="outline" disabled>
              <RefreshCw />
              Muat ulang
            </Button>
          </>
        }
      />

      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="font-display text-xl font-bold">
            Filter
          </CardTitle>
          <CardDescription>
            Persempit daftar berdasarkan status, tipe, sumber, meja, atau
            tanggal bisnis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {[
            'Status',
            'Tipe order',
            'Sumber',
            'Meja',
            'Tanggal bisnis',
            'Nomor order',
          ].map((label) => (
            <div key={label} className="flex flex-col gap-2">
              <Label>{label}</Label>
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>

      <DataTableSkeleton
        columns={[
          'Order',
          'Meja / tipe',
          'Status',
          'Pembayaran',
          'Total',
          'Aksi',
        ]}
        leading
      />
    </div>
  )
}

export function ModifiersPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Katalog"
        title="Modifier"
        description="Buat pilihan tambahan seperti level pedas, topping, atau ukuran."
        actions={
          <Button variant="accent" disabled>
            <Plus />
            Tambah grup
          </Button>
        }
      />
      <ModifiersLoading />
    </div>
  )
}

export function TablesPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operasional"
        title="Meja & QR"
        description="Kelola meja, status sesi, dan kartu QR untuk customer."
        actions={
          <>
            <Button variant="outline" disabled>
              Unduh PDF
            </Button>
            <Button variant="accent" disabled>
              <Plus />
              Tambah meja
            </Button>
          </>
        }
      />
      <TablesLoading />
    </div>
  )
}

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
