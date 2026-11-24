import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '@/features/admin/components/pagination'

describe('Pagination', () => {
  it('shows the current range and changes page or page size', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()

    render(
      <Pagination
        meta={{ page: 2, pageSize: 20, total: 45, totalPages: 3 }}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />,
    )

    expect(screen.getByText('Menampilkan 21–40 dari 45')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Halaman 3' }))
    expect(onPageChange).toHaveBeenLastCalledWith(3)

    await user.click(screen.getByRole('button', { name: 'Halaman sebelumnya' }))
    expect(onPageChange).toHaveBeenLastCalledWith(1)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Baris per halaman' }),
      '50',
    )
    expect(onPageSizeChange).toHaveBeenLastCalledWith(50)
  })

  it('clamps a page that no longer exists', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination
        meta={{ page: 5, pageSize: 20, total: 30, totalPages: 2 }}
        onPageChange={onPageChange}
      />,
    )

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
