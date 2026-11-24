import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ApiError } from '@/lib/api/client'
import { usePaymentStatus, usePublicMenu, useQuote } from '../api/customer-api'
import type { PublicMenu, QuoteTotals } from '../api/types'
import { useCartStore } from '../stores/cart-store'
import { CustomerMenuPage } from './customer-menu-page'

vi.mock('../api/customer-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/customer-api')>()
  return {
    ...actual,
    usePublicMenu: vi.fn(),
    useQuote: vi.fn(),
    usePaymentStatus: vi.fn(),
  }
})

const menu: PublicMenu = {
  table: {
    id: 'table-1',
    code: 'M01',
    name: 'Meja 01',
    zone: 'Indoor',
  },
  outlet: {
    id: 'outlet-1',
    name: 'Rembuk',
    slug: 'rembuk',
  },
  session: null,
  categories: [
    {
      id: 'food',
      name: 'Makanan',
      sortOrder: 0,
      items: [
        {
          id: 'nasi',
          name: 'Nasi Goreng Rembuk',
          description: 'Pedas gurih',
          price: 28000,
          imageUrl: null,
          isAvailable: true,
          sortOrder: 0,
          modifierGroups: [],
        },
      ],
    },
    {
      id: 'drink',
      name: 'Minuman',
      sortOrder: 1,
      items: [
        {
          id: 'tea',
          name: 'Es Teh',
          description: 'Manis dingin',
          price: 8000,
          imageUrl: null,
          isAvailable: true,
          sortOrder: 0,
          modifierGroups: [],
        },
      ],
    },
  ],
}

const quote: QuoteTotals = {
  subtotal: 28000,
  discountAmount: 0,
  serviceAmount: 1400,
  taxAmount: 2940,
  total: 32340,
  taxInclusive: false,
  taxBaseIncludesService: true,
  taxRateBp: 1000,
  serviceRateBp: 500,
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/t/M01']}>
        <Routes>
          <Route path="/t/:code" element={<CustomerMenuPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CustomerMenuPage', () => {
  beforeEach(() => {
    useCartStore.setState({ tableCode: null, lines: [] })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    vi.mocked(usePublicMenu).mockReturnValue({
      data: menu,
      isPending: false,
      error: null,
    } as never)
    vi.mocked(useQuote).mockReturnValue({
      data: quote,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    } as never)
    vi.mocked(usePaymentStatus).mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('renders the table menu and filters by search', async () => {
    const user = userEvent.setup()

    renderPage()

    expect(screen.getByRole('heading', { name: 'Meja 01' })).toBeInTheDocument()
    expect(screen.getByText('Nasi Goreng Rembuk')).toBeInTheDocument()
    expect(screen.getByText('Es Teh')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Cari menu'), 'teh')

    expect(screen.getByText('Es Teh')).toBeInTheDocument()
    expect(screen.queryByText('Nasi Goreng Rembuk')).not.toBeInTheDocument()
  })

  it('shows a table error when the menu cannot be loaded', () => {
    vi.mocked(usePublicMenu).mockReturnValue({
      data: undefined,
      isPending: false,
      error: new ApiError('Meja tidak ditemukan', 404),
    } as never)

    renderPage()

    expect(screen.getByText('Meja tidak bisa dibuka')).toBeInTheDocument()
    expect(screen.getByText('Meja tidak ditemukan')).toBeInTheDocument()
  })
})
