import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/auth/auth-store'
import { bootstrapSession, canAccessAdmin } from '@/lib/auth/session'
import { AdminBootScreen } from './admin-guard'
import { AdminLoginForm } from '../components/admin-login-form'
import { LoginAside } from '../components/login-aside'

export function AdminLoginPage() {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  useEffect(() => {
    if (status === 'idle') {
      void bootstrapSession()
    }
  }, [status])

  if (status === 'idle' || status === 'loading') {
    return <AdminBootScreen />
  }

  if (status === 'authenticated' && user && canAccessAdmin(user.role)) {
    return <Navigate to={from} replace />
  }

  return (
    <main className="bg-rice text-pine min-h-svh lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <LoginAside />

      <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <BrandLockup className="h-9" />
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft />
                Beranda
              </Link>
            </Button>
          </div>

          <AdminLoginForm redirectTo={from} />

          <p className="text-muted-foreground mt-6 text-center text-xs leading-5">
            Sesi admin memakai cookie httpOnly. Access token tidak disimpan di
            localStorage.
          </p>
        </div>
      </section>
    </main>
  )
}
