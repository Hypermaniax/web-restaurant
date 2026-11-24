import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/lib/auth/auth-store'
import { bootstrapSession, canAccessAdmin } from '@/lib/auth/session'

export function AdminBootScreen() {
  return (
    <main className="bg-muted/45 text-pine min-h-svh">
      <span className="sr-only">Memuat sesi admin</span>
      <aside className="border-pine/10 bg-pine fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r lg:flex">
        <div className="flex h-20 items-center px-6">
          <BrandLockup variant="dark" className="h-9" />
        </div>
        <div className="flex flex-1 flex-col gap-2 px-3 py-4">
          <Skeleton className="bg-rice/10 mb-2 h-3 w-20" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="bg-rice/8 h-10 w-full rounded-xl"
            />
          ))}
        </div>
        <div className="border-rice/10 border-t p-3">
          <Skeleton className="bg-rice/8 h-24 w-full rounded-2xl" />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="border-pine/10 bg-rice/90 flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-6 lg:hidden">
          <BrandLockup className="h-8" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-72 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-card flex flex-col gap-3 rounded-2xl border p-5"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-28" />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-52 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    </main>
  )
}

export function AdminGuard() {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  useEffect(() => {
    if (status === 'idle') {
      void bootstrapSession()
    }
  }, [status])

  if (status === 'idle' || status === 'loading') {
    return <AdminBootScreen />
  }

  if (!user || !canAccessAdmin(user.role)) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <Outlet />
}
