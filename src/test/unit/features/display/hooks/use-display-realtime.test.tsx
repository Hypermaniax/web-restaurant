import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { DisplayQueueView } from '@/features/display/api/display-api'
import { displayKeys } from '@/features/display/api/display-api'
import { useDisplayRealtime } from '@/features/display/hooks/use-display-realtime'

const { handlers, ioMock } = vi.hoisted(() => {
  const handlers = new Map<string, (payload?: unknown) => void>()
  const socket = {
    on: vi.fn((event: string, handler: (payload?: unknown) => void) => {
      handlers.set(event, handler)
    }),
    off: vi.fn(),
    disconnect: vi.fn(),
  }
  return { handlers, ioMock: vi.fn(() => socket) }
})

vi.mock('socket.io-client', () => ({
  io: ioMock,
}))

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
}

describe('useDisplayRealtime', () => {
  beforeEach(() => {
    handlers.clear()
    vi.clearAllMocks()
  })

  it('joins the public display channel and refreshes on connect', () => {
    const queryClient = createClient()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useDisplayRealtime(), { wrapper })

    expect(ioMock).toHaveBeenCalledWith(
      'http://localhost:3000',
      expect.objectContaining({ auth: { channel: 'display' } }),
    )

    act(() => handlers.get('connect')?.())

    expect(result.current.connected).toBe(true)
    expect(result.current.lastEventAt).not.toBeNull()
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: displayKeys.queue,
    })
  })

  it('applies safe queue updates without storing extra payload fields', () => {
    const queryClient = createClient()
    queryClient.setQueryData<DisplayQueueView>(displayKeys.queue, {
      preparing: [
        {
          queueNumber: 1,
          orderType: 'DINE_IN',
          tableCode: 'T01',
          status: 'PREPARING',
        },
      ],
      ready: [],
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    renderHook(() => useDisplayRealtime(), { wrapper })

    act(() =>
      handlers.get('queue.updated')?.({
        queue: {
          queueNumber: 1,
          orderType: 'DINE_IN',
          tableCode: 'T01',
          status: 'READY',
          customerName: 'Siti',
          total: 90_000,
        },
      }),
    )

    const view = queryClient.getQueryData<DisplayQueueView>(displayKeys.queue)
    expect(view?.preparing).toEqual([])
    expect(view?.ready).toEqual([
      {
        queueNumber: 1,
        orderType: 'DINE_IN',
        tableCode: 'T01',
        status: 'READY',
      },
    ])
    expect(view?.ready[0]).not.toHaveProperty('customerName')
    expect(view?.ready[0]).not.toHaveProperty('total')
  })

  it('ignores malformed events and marks the socket disconnected', () => {
    const queryClient = createClient()
    queryClient.setQueryData<DisplayQueueView>(displayKeys.queue, {
      preparing: [],
      ready: [],
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useDisplayRealtime(), { wrapper })

    act(() =>
      handlers.get('queue.updated')?.({
        queue: { queueNumber: 'x', status: 'READY' },
      }),
    )
    expect(queryClient.getQueryData(displayKeys.queue)).toEqual({
      preparing: [],
      ready: [],
    })

    act(() => handlers.get('disconnect')?.())
    expect(result.current.connected).toBe(false)
  })
})
