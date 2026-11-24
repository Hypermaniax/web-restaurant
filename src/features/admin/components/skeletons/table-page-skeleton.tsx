import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableSkeleton } from '../data-table-skeleton'
import { PageHeader } from '../page-header'

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
