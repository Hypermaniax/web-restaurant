import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { adminApi } from '../api/admin-api'
import type { Category } from '../api/types'
import { CategoryDialog } from './category-dialog'

const category: Category = {
  id: 'category-1',
  outletId: 'outlet-1',
  name: 'Makanan',
  sortOrder: 2,
  isActive: true,
}

function renderDialog() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <CategoryDialog open onOpenChange={vi.fn()} category={category} />
    </QueryClientProvider>,
  )
}

describe('CategoryDialog', () => {
  it('submits edited category values', async () => {
    const update = vi
      .spyOn(adminApi.categories, 'update')
      .mockResolvedValue({ message: 'Kategori diperbarui' } as never)
    const user = userEvent.setup()

    renderDialog()

    await waitFor(() => {
      expect(screen.getByLabelText('Nama kategori')).toHaveValue('Makanan')
    })

    await user.clear(screen.getByLabelText('Nama kategori'))
    await user.type(screen.getByLabelText('Nama kategori'), 'Minuman')
    await user.clear(screen.getByLabelText('Urutan'))
    await user.type(screen.getByLabelText('Urutan'), '3')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith('category-1', {
        name: 'Minuman',
        sortOrder: 3,
        isActive: true,
      })
    })
  })
})
