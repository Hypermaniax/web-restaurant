import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminErrorState } from '@/features/admin/components/admin-error-state'

describe('AdminErrorState', () => {
  it('renders the message and retries', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()

    render(
      <AdminErrorState
        title="Data gagal dimuat"
        message="Coba beberapa saat lagi."
        onRetry={onRetry}
      />,
    )

    expect(screen.getByText('Data gagal dimuat')).toBeInTheDocument()
    expect(screen.getByText('Coba beberapa saat lagi.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })
})
