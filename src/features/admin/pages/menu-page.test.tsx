import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import {
  useCategories,
  useMenuItems,
  useModifierGroups,
} from '../api/admin-api'
import type { Category, MenuItem } from '../api/types'
import { MenuPage } from './menu-page'

vi.mock('../api/admin-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/admin-api')>()
  return {
    ...actual,
    useMenuItems: vi.fn(),
    useCategories: vi.fn(),
    useModifierGroups: vi.fn(),
  }
})

const categories: Category[] = [
  {
    id: 'food',
    outletId: 'outlet-1',
    name: 'Makanan',
    sortOrder: 0,
    isActive: true,
  },
]

const menuItem: MenuItem = {
  id: 'menu-1',
  outletId: 'outlet-1',
  categoryId: 'food',
  categoryName: 'Makanan',
  name: 'Nasi Goreng Rembuk',
  description: 'Pedas gurih',
  price: 28000,
  imageUrl: null,
  isAvailable: true,
  isActive: true,
  sortOrder: 0,
  modifierGroups: [],
  createdAt: '2026-11-22T00:00:00.000Z',
  updatedAt: '2026-11-22T00:00:00.000Z',
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MenuPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MenuPage', () => {
  beforeEach(() => {
    vi.mocked(useMenuItems).mockReturnValue({
      data: {
        items: [menuItem],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
    vi.mocked(useCategories).mockReturnValue({
      data: categories,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
    vi.mocked(useModifierGroups).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('renders menu rows and opens the create dialog', async () => {
    const user = userEvent.setup()

    renderPage()

    expect(screen.getByText('Nasi Goreng Rembuk')).toBeInTheDocument()
    expect(screen.getByText('Makanan')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tambah menu' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Tambah menu')).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Nama menu')).toBeInTheDocument()
  })
})
