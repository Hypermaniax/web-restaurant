import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth/auth-store'
import { AdminLoginPage } from './admin-login-page'

describe('AdminLoginPage', () => {
  afterEach(() => {
    useAuthStore.getState().clearSession()
  })

  it('renders the staff login form', () => {
    useAuthStore.getState().clearSession()

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <AdminLoginPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^masuk$/i })).toBeInTheDocument()
  })
})
