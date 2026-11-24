import { render, screen, waitFor } from '@testing-library/react'
import { useDisplayQueue, type DisplayQueueItem } from '../api/display-api'
import { useDisplayRealtime } from '../hooks/use-display-realtime'
import { DisplayPage } from './display-page'

vi.mock('../api/display-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/display-api')>()
  return { ...actual, useDisplayQueue: vi.fn() }
})

vi.mock('../hooks/use-display-realtime', () => ({
  useDisplayRealtime: vi.fn(),
}))

function makeItem(overrides: Partial<DisplayQueueItem>): DisplayQueueItem {
  return {
    queueNumber: 1,
    orderType: 'DINE_IN',
    tableCode: 'T01',
    status: 'PREPARING',
    ...overrides,
  }
}

function mockQueue(
  overrides: Partial<ReturnType<typeof useDisplayQueue>> = {},
) {
  vi.mocked(useDisplayQueue).mockReturnValue({
    data: { preparing: [], ready: [] },
    dataUpdatedAt: Date.now(),
    isLoading: false,
    isError: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as never)
}

describe('DisplayPage', () => {
  beforeEach(() => {
    vi.mocked(useDisplayRealtime).mockReturnValue({
      connected: true,
      lastEventAt: null,
    })
    mockQueue()
  })

  it('renders both queue columns without customer or order details', () => {
    mockQueue({
      data: {
        preparing: [
          {
            ...makeItem({ queueNumber: 12 }),
            customerName: 'Siti',
            total: 150_000,
            items: [{ name: 'Nasi Goreng' }],
          } as DisplayQueueItem,
        ],
        ready: [
          makeItem({
            queueNumber: 9,
            orderType: 'TAKEAWAY',
            tableCode: null,
            status: 'READY',
          }),
        ],
      },
    })

    render(<DisplayPage />)

    expect(
      screen.getByRole('heading', { name: 'Sedang disiapkan' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Siap diambil' }),
    ).toBeInTheDocument()
    expect(screen.getByText('A-012')).toBeInTheDocument()
    expect(screen.getByText('A-009')).toBeInTheDocument()
    expect(screen.getAllByText('Dine-in').length).toBeGreaterThan(0)
    expect(screen.getByText('Meja T01')).toBeInTheDocument()
    expect(screen.getByText('Takeaway')).toBeInTheDocument()
    expect(screen.getByText('Ambil di kasir')).toBeInTheDocument()
    expect(screen.queryByText('Siti')).not.toBeInTheDocument()
    expect(screen.queryByText('Nasi Goreng')).not.toBeInTheDocument()
    expect(screen.queryByText(/150\.000/)).not.toBeInTheDocument()
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('keeps showing the last data when the socket disconnects', () => {
    vi.mocked(useDisplayRealtime).mockReturnValue({
      connected: false,
      lastEventAt: Date.now(),
    })
    mockQueue({
      data: { preparing: [makeItem({ queueNumber: 4 })], ready: [] },
    })

    render(<DisplayPage />)

    expect(screen.getByText('Polling')).toBeInTheDocument()
    expect(screen.getByText(/Data /)).toBeInTheDocument()
    expect(screen.getByText('A-004')).toBeInTheDocument()
  })

  it('shows an empty state and a retry state', () => {
    const { rerender } = render(<DisplayPage />)

    expect(screen.getByText('Belum ada antrian')).toBeInTheDocument()
    expect(screen.getByText('Belum ada pesanan siap')).toBeInTheDocument()

    mockQueue({
      data: undefined,
      dataUpdatedAt: 0,
      isError: true,
    })
    rerender(<DisplayPage />)

    expect(screen.getByText('Antrian belum bisa dimuat')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Coba lagi' }),
    ).toBeInTheDocument()
  })

  it('highlights an order that changes to ready after initial load', async () => {
    mockQueue({
      data: {
        preparing: [makeItem({ queueNumber: 2 })],
        ready: [makeItem({ queueNumber: 1, status: 'READY' })],
      },
    })

    const { rerender } = render(<DisplayPage />)
    expect(screen.queryByText('Baru')).not.toBeInTheDocument()

    mockQueue({
      data: {
        preparing: [],
        ready: [
          makeItem({ queueNumber: 1, status: 'READY' }),
          makeItem({ queueNumber: 2, status: 'READY' }),
        ],
      },
    })
    rerender(<DisplayPage />)

    await waitFor(() => {
      expect(screen.getByText('Baru')).toBeInTheDocument()
    })
  })
})
