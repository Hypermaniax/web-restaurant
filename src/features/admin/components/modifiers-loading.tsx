import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ModifiersLoading() {
  return (
    <div className="grid gap-4 xl:grid-cols-2" role="status" aria-busy="true">
      <span className="sr-only">Memuat modifier</span>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="gap-0 overflow-hidden py-0" aria-hidden>
          <CardHeader className="bg-muted/25 border-b px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-52 max-w-full" />
              </div>
              <Skeleton className="size-9 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {Array.from({ length: 3 }).map((__, row) => (
              <div
                key={row}
                className="flex items-center justify-between gap-4 border-b px-5 py-3 last:border-b-0"
              >
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-7 w-16" />
              </div>
            ))}
            <div className="border-t px-5 py-3">
              <Skeleton className="h-8 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
