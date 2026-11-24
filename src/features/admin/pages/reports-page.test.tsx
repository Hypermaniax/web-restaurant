import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { downloadFile } from '@/lib/download'
import {
  useCancellationReport,
  useDailyReport,
  useItemReport,
  usePaymentReport,
  useTaxReport,
} from '../api/reports-api'
import { ReportsPage } from './reports-page'

vi.mock('@/lib/download', () => ({
  downloadFile: vi.fn(),
}))

vi.mock('../api/reports-api', () => ({
  reportsApi: {
    exportPath: vi.fn(() => '/admin/reports/export?type=daily'),
  },
  useDailyReport: vi.fn(),
  usePaymentReport: vi.fn(),
  useItemReport: vi.fn(),
  useTaxReport: vi.fn(),
  useCancellationReport: vi.fn(),
}))

describe('ReportsPage', () => {
  beforeEach(() => {
    vi.mocked(useDailyReport).mockReturnValue({
      data: {
        date: '2026-11-22',
        orderCount: 2,
        subtotal: 100_000,
        tax: 11_000,
        service: 10_000,
        discount: 0,
        revenue: 121_000,
        orderTypes: [
          {
            orderType: 'DINE_IN',
            orderCount: 2,
            subtotal: 100_000,
            tax: 11_000,
            service: 10_000,
            discount: 0,
            revenue: 121_000,
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)

    vi.mocked(usePaymentReport).mockReturnValue({
      data: { date: '2026-11-22', totalAmount: 121_000, rows: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
    vi.mocked(useItemReport).mockReturnValue({
      data: { date: '2026-11-22', totalQty: 0, totalRevenue: 0, rows: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
    vi.mocked(useTaxReport).mockReturnValue({
      data: { date: '2026-11-22', totalTax: 11_000, rows: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
    vi.mocked(useCancellationReport).mockReturnValue({
      data: {
        date: '2026-11-22',
        count: 0,
        totalAmount: 0,
        rows: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('renders server totals and report controls', () => {
    render(<ReportsPage />)

    expect(screen.getAllByText('Omzet').length).toBeGreaterThan(0)
    expect(screen.getByText('Omzet per tipe order')).toBeInTheDocument()
    expect(screen.getByText('Export CSV')).toBeInTheDocument()
    expect(screen.getByLabelText('Tanggal bisnis')).toBeInTheDocument()
    expect(screen.getAllByText('Dine-in').length).toBeGreaterThan(0)
  })

  it('exports the selected report as CSV', async () => {
    const user = userEvent.setup()

    render(<ReportsPage />)
    await user.click(screen.getByRole('button', { name: 'Export CSV' }))

    await waitFor(() => {
      expect(downloadFile).toHaveBeenCalledWith(
        '/admin/reports/export?type=daily',
        expect.stringMatching(/^report-daily-.*\.csv$/),
      )
    })
  })
})
