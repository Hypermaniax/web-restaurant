import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { adminApi } from '@/features/admin/api/admin-api'
import type { Staff } from '@/features/admin/api/types'
import { StaffPasswordDialog } from '@/features/admin/components/staff-password-dialog'

const staff: Staff = {
  id: 'staff-1',
  outletId: 'outlet-1',
  name: 'Kasir Satu',
  email: 'kasir@rembuk.local',
  role: 'CASHIER',
  isActive: true,
  lastLoginAt: null,
  createdAt: '2026-11-22T00:00:00.000Z',
}

function renderDialog() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <StaffPasswordDialog staff={staff} onOpenChange={vi.fn()} />
    </QueryClientProvider>,
  )
}

describe('StaffPasswordDialog', () => {
  it('resets the selected staff password', async () => {
    const resetPassword = vi
      .spyOn(adminApi.staff, 'resetPassword')
      .mockResolvedValue({ message: 'Password direset' } as never)
    const user = userEvent.setup()

    renderDialog()

    expect(
      screen.getByText('Password baru untuk Kasir Satu.'),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('Password baru'), 'password456')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('staff-1', 'password456')
    })
  })
})
