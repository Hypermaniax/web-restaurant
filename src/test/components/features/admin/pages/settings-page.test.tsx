import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  adminApi,
  useSettings,
  useTaxRules,
} from '@/features/admin/api/admin-api'
import { SettingsPage } from '@/features/admin/pages/settings-page'

vi.mock('@/features/admin/api/admin-api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/admin/api/admin-api')>()
  return {
    ...actual,
    useSettings: vi.fn(),
    useTaxRules: vi.fn(),
  }
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <SettingsPage />
    </QueryClientProvider>,
  )
}

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.mocked(useSettings).mockReturnValue({
      data: {
        outletId: 'outlet-1',
        taxInclusive: false,
        taxBaseIncludesService: true,
        serviceRateBp: 1000,
        requirePaymentBeforeKitchen: true,
        orderExpiryMinutes: 15,
        cashExpiryMinutes: 30,
        receiptFooter: null,
        updatedAt: '2026-11-22T00:00:00.000Z',
        qrBaseUrl: 'http://localhost:5173',
      },
      isLoading: false,
      isError: false,
      error: null,
    } as never)

    vi.mocked(useTaxRules).mockReturnValue({
      data: [
        {
          id: 'rule-1',
          outletId: 'outlet-1',
          orderType: 'DINE_IN',
          isEnabled: true,
          rateBp: 1100,
          updatedAt: '2026-11-22T00:00:00.000Z',
        },
        {
          id: 'rule-2',
          outletId: 'outlet-1',
          orderType: 'TAKEAWAY',
          isEnabled: false,
          rateBp: 0,
          updatedAt: '2026-11-22T00:00:00.000Z',
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as never)
  })

  it('renders the tax form, preview, and QR warning', () => {
    renderPage()

    expect(screen.getByLabelText('Service charge (%)')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Tarif pajak (%)')).toHaveLength(2)
    expect(screen.getByText('Preview perhitungan')).toBeInTheDocument()
    expect(screen.getByText('QR_BASE_URL masih localhost')).toBeInTheDocument()
    expect(screen.getByText('http://localhost:5173')).toBeInTheDocument()
  })

  it('saves settings and both tax rules with mapped values', async () => {
    const update = vi
      .spyOn(adminApi.settings, 'update')
      .mockResolvedValue({} as never)
    const updateTaxRule = vi
      .spyOn(adminApi.settings, 'updateTaxRule')
      .mockResolvedValue({} as never)
    const user = userEvent.setup()

    renderPage()
    await user.click(screen.getByRole('button', { name: 'Simpan pengaturan' }))

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith({
        taxInclusive: false,
        taxBaseIncludesService: true,
        serviceRateBp: 1000,
        requirePaymentBeforeKitchen: true,
        orderExpiryMinutes: 15,
        cashExpiryMinutes: 30,
        receiptFooter: null,
      })
    })
    expect(updateTaxRule).toHaveBeenCalledWith('DINE_IN', {
      isEnabled: true,
      rateBp: 1100,
    })
    expect(updateTaxRule).toHaveBeenCalledWith('TAKEAWAY', {
      isEnabled: false,
      rateBp: 0,
    })
  })
})
