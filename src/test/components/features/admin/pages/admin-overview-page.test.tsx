import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useDashboard } from '@/features/admin/api/admin-api'
import { AdminOverviewPage } from '@/features/admin/pages/admin-overview-page'

vi.mock('@/features/admin/api/admin-api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/admin/api/admin-api')>()
  return {
    ...actual,
    useDashboard: vi.fn(),
  }
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminOverviewPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AdminOverviewPage', () => {
  beforeEach(() => {
    vi.mocked(useDashboard).mockReturnValue({
      data: {
        businessDate: '2026-11-22',
        revenueToday: 150_000,
        openTables: 2,
        pendingPayments: 1,
        kdsQueue: 3,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('renders summary stats and operational shortcuts', () => {
    renderPage()

    expect(screen.getByText('Omzet hari ini')).toBeInTheDocument()
    expect(screen.getByText('Meja terbuka')).toBeInTheDocument()
    expect(screen.getByText('Pembayaran tertunda')).toBeInTheDocument()
    expect(screen.getByText('Antrian dapur')).toBeInTheDocument()
    expect(screen.getByText('Buka order monitor')).toBeInTheDocument()
    expect(screen.getByText('Layar antrian')).toBeInTheDocument()
    expect(screen.getByText('Buka display')).toBeInTheDocument()
  })
})
