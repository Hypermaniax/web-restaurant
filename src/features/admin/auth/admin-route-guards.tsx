import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth/auth-store'
import { AdminOverviewPage } from '../pages/admin-overview-page'

export function AdminIndexPage() {
  const role = useAuthStore((state) => state.user?.role)

  if (role === 'CASHIER') {
    return <Navigate to="/admin/orders" replace />
  }

  return <AdminOverviewPage />
}

export function AdminOnly({ children }: { children: ReactNode }) {
  const role = useAuthStore((state) => state.user?.role)

  if (role !== 'ADMIN') {
    return <Navigate to="/admin/orders" replace />
  }

  return children
}
