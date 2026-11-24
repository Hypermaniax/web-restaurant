import { RefreshCw, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableSkeleton } from '../data-table-skeleton'
import { PageHeader } from '../page-header'

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
