import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from './page-header'

interface StaffHeaderProps {
  onCreate: () => void
}

export function StaffHeader({ onCreate }: StaffHeaderProps) {
  return (
    <PageHeader
      eyebrow="Restoran"
      title="Staff"
      description="Kelola akses ADMIN, CASHIER, dan KITCHEN. API tetap menjadi sumber enforcement."
      actions={
        <Button variant="accent" onClick={onCreate}>
          <Plus />
          Tambah staff
        </Button>
      }
    />
  )
}
