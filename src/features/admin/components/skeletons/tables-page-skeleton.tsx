import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '../page-header'
import { TablesLoading } from '../tables-feedback'

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
