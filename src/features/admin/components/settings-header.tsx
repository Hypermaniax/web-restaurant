import { LockKeyhole } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from './page-header'

interface SettingsHeaderProps {
  description: string
  showAdminBadge?: boolean
}

export function SettingsHeader({
  description,
  showAdminBadge = false,
}: SettingsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Pengaturan"
      title="Pajak & service"
      description={description}
      actions={
        showAdminBadge ? (
          <Badge variant="outline" className="h-9 gap-2 px-3">
            <LockKeyhole />
            Admin only
          </Badge>
        ) : undefined
      }
    />
  )
}
