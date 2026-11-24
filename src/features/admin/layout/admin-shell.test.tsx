import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth/auth-store'
import type { AuthUser } from '@/lib/auth/types'
import { AdminShell } from './admin-shell'

const cashier: AuthUser = {
  id: 'cashier-1',
  outletId: 'outlet-1',
  name: 'Kasir Rembuk',
  email: 'kasir@rembuk.local',
  role: 'CASHIER',
  isActive: true,
  lastLoginAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
}

function renderShell() {
  useAuthStore.getState().setSession({ accessToken: 'token', user: cashier })

  render(
    <MemoryRouter initialEntries={['/admin/orders']}>
      <Routes>
        <Route element={<AdminShell />}>
          <Route path="/admin/orders" element={<div>Order page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminShell', () => {
  afterEach(() => {
    useAuthStore.getState().clearSession()
  })

  it('renders only navigation allowed for the current role', () => {
    renderShell()

    expect(screen.getByText('Order page')).toBeInTheDocument()
    expect(screen.getAllByText('Order').length).toBeGreaterThan(0)
    expect(screen.queryByText('Kategori')).not.toBeInTheDocument()
    expect(screen.getAllByText('Kasir').length).toBeGreaterThan(0)
  })
})
