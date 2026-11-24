import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSettings, useTables } from '@/features/admin/api/admin-api'
import type { Table } from '@/features/admin/api/types'
import { TablesPage } from '@/features/admin/pages/tables-page'

vi.mock('@/features/admin/api/admin-api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/admin/api/admin-api')>()
  return {
    ...actual,
    useTables: vi.fn(),
    useSettings: vi.fn(),
  }
})

const table: Table = {
  id: 'table-1',
  outletId: 'outlet-1',
  code: 'T01',
  name: 'Meja 01',
  zone: 'Indoor',
  status: 'AVAILABLE',
  isActive: true,
  openSession: null,
  createdAt: '2026-11-22T00:00:00.000Z',
  updatedAt: '2026-11-22T00:00:00.000Z',
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <TablesPage />
    </QueryClientProvider>,
  )
}

describe('TablesPage', () => {
  beforeEach(() => {
    vi.mocked(useTables).mockReturnValue({
      data: {
        items: [table],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
    vi.mocked(useSettings).mockReturnValue({
      data: { qrBaseUrl: 'http://localhost:5173' },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('renders table cards, local QR warning, and create dialog', async () => {
    const user = userEvent.setup()

    renderPage()

    expect(screen.getByText('T01')).toBeInTheDocument()
    expect(screen.getByText(/Meja 01/)).toBeInTheDocument()
    expect(screen.getByText('QR masih memakai URL lokal')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tambah meja' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Tambah meja')).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Kode meja')).toBeInTheDocument()
  })
})
