import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { adminApi, useModifierGroupsPage } from '@/features/admin/api/admin-api'
import { ModifiersPage } from '@/features/admin/pages/modifiers-page'

vi.mock('@/features/admin/api/admin-api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/admin/api/admin-api')>()
  return {
    ...actual,
    useModifierGroupsPage: vi.fn(),
  }
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ModifiersPage />
    </QueryClientProvider>,
  )
}

describe('ModifiersPage', () => {
  beforeEach(() => {
    vi.mocked(useModifierGroupsPage).mockReturnValue({
      data: {
        items: [
          {
            id: 'group-1',
            outletId: 'outlet-1',
            name: 'Level Pedas',
            selectionType: 'MULTIPLE',
            minSelect: 1,
            maxSelect: 3,
            isRequired: true,
            isActive: true,
            sortOrder: 0,
            options: [
              {
                id: 'option-1',
                groupId: 'group-1',
                name: 'Pedas sedang',
                priceDelta: 2000,
                isDefault: true,
                isActive: true,
                sortOrder: 0,
              },
            ],
          },
        ],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never)
  })

  it('renders modifier groups and their options', () => {
    renderPage()

    expect(screen.getByText('Level Pedas')).toBeInTheDocument()
    expect(screen.getByText('Pedas sedang')).toBeInTheDocument()
    expect(screen.getByText(/Pilih banyak/)).toBeInTheDocument()
    expect(screen.getByText('Wajib')).toBeInTheDocument()
  })

  it('creates a modifier group from the dialog', async () => {
    const createGroup = vi
      .spyOn(adminApi.modifiers, 'createGroup')
      .mockResolvedValue({} as never)
    const user = userEvent.setup()

    renderPage()
    await user.click(screen.getByRole('button', { name: 'Tambah grup' }))
    await user.type(screen.getByLabelText('Nama grup'), 'Topping')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(createGroup).toHaveBeenCalledWith({
        name: 'Topping',
        selectionType: 'SINGLE',
        minSelect: 1,
        maxSelect: 1,
        isRequired: true,
        isActive: true,
        sortOrder: 0,
      })
    })
  })
})
