import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth/auth-store'
import type { AuthUser } from '@/lib/auth/types'
import { AdminOnly } from '@/features/admin/auth/admin-route-guards'

const admin: AuthUser = {
  id: 'admin-1',
  outletId: 'outlet-1',
  name: 'Admin Rembuk',
  email: 'admin@rembuk.local',
  role: 'ADMIN',
  isActive: true,
  lastLoginAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const cashier: AuthUser = {
  ...admin,
  id: 'cashier-1',
  name: 'Kasir Rembuk',
  email: 'kasir@rembuk.local',
  role: 'CASHIER',
}

function renderGuard(user: AuthUser) {
  useAuthStore.getState().setSession({ accessToken: 'token', user })

  render(
    <MemoryRouter initialEntries={['/admin/catalog/menu']}>
      <Routes>
        <Route
          path="/admin/catalog/menu"
          element={
            <AdminOnly>
              <div>Admin only content</div>
            </AdminOnly>
          }
        />
        <Route path="/admin/orders" element={<div>Order monitor</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminOnly', () => {
  afterEach(() => {
    useAuthStore.getState().clearSession()
  })

  it('allows ADMIN routes', () => {
    renderGuard(admin)
    expect(screen.getByText('Admin only content')).toBeInTheDocument()
  })

  it('redirects CASHIER away from admin-only routes', () => {
    renderGuard(cashier)
    expect(screen.getByText('Order monitor')).toBeInTheDocument()
    expect(screen.queryByText('Admin only content')).not.toBeInTheDocument()
  })
})
