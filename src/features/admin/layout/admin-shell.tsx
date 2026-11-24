import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth/auth-store'
import { logout } from '@/lib/auth/session'
import { AdminMobileNav } from '../components/admin-mobile-nav'
import { AdminSidebar } from '../components/admin-sidebar'
import { navItems } from '../lib/admin-nav'

export function AdminShell() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  )

  async function handleLogout() {
    try {
      await logout()
      toast.success('Logout berhasil')
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <div className="bg-muted/45 text-pine min-h-svh">
      <AdminSidebar
        user={user}
        items={visibleItems}
        onLogout={() => void handleLogout()}
      />

      <div className="lg:pl-64">
        <AdminMobileNav
          user={user}
          items={visibleItems}
          onLogout={() => void handleLogout()}
        />

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
