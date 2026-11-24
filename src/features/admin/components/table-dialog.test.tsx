import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { adminApi } from '../api/admin-api'
import type { Table } from '../api/types'
import { TableDialog } from './table-dialog'

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

function renderDialog() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <TableDialog open onOpenChange={vi.fn()} table={table} />
    </QueryClientProvider>,
  )
}

describe('TableDialog', () => {
  it('submits edited table values', async () => {
    const update = vi
      .spyOn(adminApi.tables, 'update')
      .mockResolvedValue({ message: 'Meja diperbarui' } as never)
    const user = userEvent.setup()

    renderDialog()

    expect(screen.getByLabelText('Kode meja')).toHaveValue('T01')
    await user.clear(screen.getByLabelText('Nama meja'))
    await user.type(screen.getByLabelText('Nama meja'), 'Meja Utama')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() => {
      expect(update).toHaveBeenCalledWith('table-1', {
        code: 'T01',
        name: 'Meja Utama',
        zone: 'Indoor',
        isActive: true,
      })
    })
  })
})
