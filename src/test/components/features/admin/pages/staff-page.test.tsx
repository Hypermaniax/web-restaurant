import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useStaff } from '@/features/admin/api/admin-api'
import type { Staff } from '@/features/admin/api/types'
import { StaffPage } from '@/features/admin/pages/staff-page'

vi.mock('@/features/admin/api/admin-api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/admin/api/admin-api')>()
  return {
    ...actual,
    useStaff: vi.fn(),
  }
})

const staff: Staff[] = [
  {
    id: 'staff-1',
    outletId: 'outlet-1',
    name: 'Kasir Satu',
    email: 'kasir@rembuk.local',
    role: 'CASHIER',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2026-11-22T00:00:00.000Z',
  },
  {
    id: 'staff-2',
    outletId: 'outlet-1',
    name: 'Admin Satu',
    email: 'admin@rembuk.local',
    role: 'ADMIN',
    isActive: false,
    lastLoginAt: '2026-11-21T00:00:00.000Z',
    createdAt: '2026-11-20T00:00:00.000Z',
  },
]

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <StaffPage />
    </QueryClientProvider>,
  )
}

describe('StaffPage', () => {
  beforeEach(() => {
    vi.mocked(useStaff).mockReturnValue({
      data: {
        items: staff,
        meta: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('renders staff rows and opens the create dialog', async () => {
    const user = userEvent.setup()

    renderPage()

    expect(screen.getByText('Kasir Satu')).toBeInTheDocument()
    expect(screen.getByText('Kasir')).toBeInTheDocument()
    expect(screen.getByText('Admin Satu')).toBeInTheDocument()
    expect(screen.getByText('Nonaktif')).toBeInTheDocument()
    expect(screen.getByText('Belum pernah')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tambah staff' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Tambah staff')).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Email')).toBeInTheDocument()
  })
})
