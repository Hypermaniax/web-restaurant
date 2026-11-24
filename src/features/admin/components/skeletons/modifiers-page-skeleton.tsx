import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModifiersLoading } from '../modifiers-loading'
import { PageHeader } from '../page-header'

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
