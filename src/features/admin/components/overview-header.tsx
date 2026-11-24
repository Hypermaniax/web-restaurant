import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import { PageHeader } from './page-header'

interface OverviewHeaderProps {
  userName: string | undefined
  businessDate: string | undefined
}

export function OverviewHeader({
  userName,
  businessDate,
}: OverviewHeaderProps) {
  return (
    <PageHeader
      eyebrow="Ringkasan"
      title={`Selamat datang, ${userName?.split(' ')[0] ?? 'Admin'}`}
      description="Ringkasan operasional hari ini. Data berasal langsung dari server."
      actions={
        <Badge variant="secondary" className="h-8 px-3">
          {businessDate ? formatDate(businessDate) : 'Hari ini'}
        </Badge>
      }
    />
  )
}
