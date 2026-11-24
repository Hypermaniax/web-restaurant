import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { adminApi } from '../api/admin-api'
import { StaffCreateDialog } from './staff-create-dialog'

function renderDialog() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <StaffCreateDialog open onOpenChange={vi.fn()} />
    </QueryClientProvider>,
  )
}

describe('StaffCreateDialog', () => {
  it('submits a new staff account', async () => {
    const create = vi
      .spyOn(adminApi.staff, 'create')
      .mockResolvedValue({ message: 'Staff dibuat' } as never)
    const user = userEvent.setup()

    renderDialog()

    await user.type(screen.getByLabelText('Nama'), 'Kasir Baru')
    await user.type(screen.getByLabelText('Email'), 'kasir2@rembuk.local')
    await user.type(screen.getByLabelText('Password awal'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(create).toHaveBeenCalledWith({
        name: 'Kasir Baru',
        email: 'kasir2@rembuk.local',
        password: 'password123',
        role: 'CASHIER',
      })
    })
  })
})
