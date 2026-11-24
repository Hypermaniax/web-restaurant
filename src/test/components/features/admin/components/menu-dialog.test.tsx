import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { adminApi } from '@/features/admin/api/admin-api'
import type {
  Category,
  MenuItem,
  ModifierGroup,
} from '@/features/admin/api/types'
import { MenuDialog } from '@/features/admin/components/menu-dialog'

const categories: Category[] = [
  {
    id: 'food',
    outletId: 'outlet-1',
    name: 'Makanan',
    sortOrder: 0,
    isActive: true,
  },
]

const modifierGroups: ModifierGroup[] = [
  {
    id: 'level',
    outletId: 'outlet-1',
    name: 'Level Pedas',
    selectionType: 'SINGLE',
    minSelect: 1,
    maxSelect: 1,
    isRequired: true,
    isActive: true,
    sortOrder: 0,
    options: [],
  },
]

const item: MenuItem = {
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
  modifierGroups,
  createdAt: '2026-11-22T00:00:00.000Z',
  updatedAt: '2026-11-22T00:00:00.000Z',
}

function renderDialog() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MenuDialog
        open
        onOpenChange={vi.fn()}
        item={item}
        categories={categories}
        modifierGroups={modifierGroups}
        imageFile={null}
        onImageFileChange={vi.fn()}
      />
    </QueryClientProvider>,
  )
}

describe('MenuDialog', () => {
  it('submits edited menu values with selected modifiers', async () => {
    const update = vi
      .spyOn(adminApi.menu, 'update')
      .mockResolvedValue({ message: 'Menu diperbarui' } as never)
    const user = userEvent.setup()

    renderDialog()

    expect(screen.getByLabelText('Nama menu')).toHaveValue('Nasi Goreng Rembuk')

    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith('menu-1', {
        categoryId: 'food',
        name: 'Nasi Goreng Rembuk',
        description: 'Pedas gurih',
        price: 28000,
        sortOrder: 0,
        isAvailable: true,
        isActive: true,
        modifierGroupIds: ['level'],
      })
    })
  })
})
