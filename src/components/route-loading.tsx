import { BrandLockup } from '@/components/brand-lockup'
import { Skeleton } from '@/components/ui/skeleton'

export function RouteLoading() {
  return (
    <main className="bg-rice text-pine min-h-svh px-5 py-6 sm:px-8">
      <span className="sr-only">Memuat halaman</span>
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <BrandLockup className="h-9" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-4 w-[28rem] max-w-full" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card flex flex-col gap-3 rounded-2xl border p-5"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-card flex flex-col gap-4 rounded-2xl border p-5"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
