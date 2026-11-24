import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableSkeletonProps {
  columns: string[]
  rows?: number
  leading?: boolean
}

export function DataTableSkeleton({
  columns,
  rows = 6,
  leading = false,
}: DataTableSkeletonProps) {
  return (
    <div
      className="border-pine/10 bg-card overflow-hidden rounded-2xl border shadow-sm"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Memuat data</span>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, row) => (
            <TableRow key={row}>
              {columns.map((column, index) => (
                <TableCell key={column}>
                  {leading && index === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-11 shrink-0 rounded-xl" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ) : (
                    <Skeleton
                      className={
                        index === columns.length - 1
                          ? 'ml-auto h-8 w-8'
                          : 'h-4 w-20'
                      }
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
