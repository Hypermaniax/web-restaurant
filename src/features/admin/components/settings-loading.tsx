import { LockKeyhole } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from './page-header'

export function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="Pajak & service"
        description="Atur pajak, service charge, expiry, dan footer struk."
        actions={
          <Badge variant="outline" className="h-9 gap-2 px-3">
            <LockKeyhole />
            Admin only
          </Badge>
        }
      />

      <Skeleton className="h-16 rounded-xl" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-4">
          <SettingsCardSkeleton
            title="Pajak & service"
            description="Nilai ini dipakai server untuk menghitung order baru."
            rows={4}
          />
          <SettingsCardSkeleton
            title="Pajak per tipe order"
            description="Dine-in dan takeaway bisa memakai tarif berbeda."
            rows={2}
          />
        </div>

        <div className="flex flex-col gap-4">
          <SettingsCardSkeleton
            title="Preview perhitungan"
            description="Contoh dihitung dari nilai form, bukan total order final."
            rows={5}
          />
          <SettingsCardSkeleton title="QR_BASE_URL aktif" rows={2} />
        </div>
      </div>
    </div>
  )
}

interface SettingsCardSkeletonProps {
  title: string
  description?: string
  rows: number
}

function SettingsCardSkeleton({
  title,
  description,
  rows,
}: SettingsCardSkeletonProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold">
          {title}
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl border p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
