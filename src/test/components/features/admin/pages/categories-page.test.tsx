import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCategoriesPage } from '@/features/admin/api/admin-api'
import type { Category } from '@/features/admin/api/types'
import { CategoriesPage } from '@/features/admin/pages/categories-page'

vi.mock('@/features/admin/api/admin-api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/admin/api/admin-api')>()
  return {
    ...actual,
    useCategoriesPage: vi.fn(),
  }
})

const categories: Category[] = [
  {
    id: 'category-1',
    outletId: 'outlet-1',
    name: 'Makanan',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'category-2',
    outletId: 'outlet-1',
    name: 'Minuman',
    sortOrder: 2,
    isActive: false,
  },
]

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <CategoriesPage />
    </QueryClientProvider>,
  )
}

describe('CategoriesPage', () => {
  beforeEach(() => {
    vi.mocked(useCategoriesPage).mockReturnValue({
      data: {
        items: categories,
        meta: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('requests the next page', async () => {
    const user = userEvent.setup()
    vi.mocked(useCategoriesPage).mockReturnValue({
      data: {
        items: categories,
        meta: { page: 1, pageSize: 20, total: 45, totalPages: 3 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)

    renderPage()
    await user.click(screen.getByRole('button', { name: 'Halaman berikutnya' }))

    expect(useCategoriesPage).toHaveBeenLastCalledWith(true, 2, 20)
  })

  it('renders categories and opens the create dialog', async () => {
    const user = userEvent.setup()

    renderPage()

    expect(screen.getByText('Makanan')).toBeInTheDocument()
    expect(screen.getByText('Minuman')).toBeInTheDocument()
    expect(screen.getByText('Aktif')).toBeInTheDocument()
    expect(screen.getByText('Nonaktif')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tambah kategori' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Tambah kategori')).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Nama kategori')).toHaveValue('')
  })
})
