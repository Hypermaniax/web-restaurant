import type { DisplayQueueItem } from '@/features/display/api/display-api'
import {
  formatQueueNumber,
  getNewReadyNumbers,
  getOrderMetaLabel,
  getVisibleQueue,
  mergeQueueUpdate,
  toQueueItem,
} from '@/features/display/lib/queue'

function makeItem(overrides: Partial<DisplayQueueItem>): DisplayQueueItem {
  return {
    queueNumber: 1,
    orderType: 'DINE_IN',
    tableCode: 'T01',
    status: 'PREPARING',
    ...overrides,
  }
}

describe('display queue helpers', () => {
  it('formats queue numbers and order metadata', () => {
    expect(formatQueueNumber(12)).toBe('A-012')
    expect(getOrderMetaLabel(makeItem({ orderType: 'DINE_IN' }))).toBe(
      'Meja T01',
    )
    expect(
      getOrderMetaLabel(makeItem({ orderType: 'TAKEAWAY', tableCode: null })),
    ).toBe('Ambil di kasir')
  })

  it('keeps only safe fields from realtime payloads', () => {
    const item = toQueueItem({
      queueNumber: 7,
      orderType: 'TAKEAWAY',
      tableCode: null,
      status: 'READY',
      customerName: 'Siti',
      total: 150_000,
      items: ['Nasi Goreng'],
    })

    expect(item).toEqual({
      queueNumber: 7,
      orderType: 'TAKEAWAY',
      tableCode: null,
      status: 'READY',
    })
    expect(item).not.toHaveProperty('customerName')
    expect(item).not.toHaveProperty('total')
  })

  it('rejects malformed realtime payloads', () => {
    expect(toQueueItem(null)).toBeNull()
    expect(
      toQueueItem({ queueNumber: 0, orderType: 'DINE_IN', status: 'READY' }),
    ).toBeNull()
    expect(
      toQueueItem({
        queueNumber: 2,
        orderType: 'DELIVERY',
        status: 'READY',
        tableCode: null,
      }),
    ).toBeNull()
  })

  it('moves an updated order between preparing and ready', () => {
    const view = {
      preparing: [makeItem({ queueNumber: 3 }), makeItem({ queueNumber: 1 })],
      ready: [makeItem({ queueNumber: 2, status: 'READY' })],
    }

    const moved = mergeQueueUpdate(
      view,
      makeItem({ queueNumber: 3, status: 'READY' }),
    )

    expect(moved.preparing.map((item) => item.queueNumber)).toEqual([1])
    expect(moved.ready.map((item) => item.queueNumber)).toEqual([2, 3])
  })

  it('removes served and cancelled orders from both columns', () => {
    const view = {
      preparing: [makeItem({ queueNumber: 1 })],
      ready: [makeItem({ queueNumber: 2, status: 'READY' })],
    }

    const served = mergeQueueUpdate(
      view,
      makeItem({ queueNumber: 1, status: 'SERVED' }),
    )
    const cancelled = mergeQueueUpdate(
      served,
      makeItem({ queueNumber: 2, status: 'CANCELLED' }),
    )

    expect(cancelled.preparing).toEqual([])
    expect(cancelled.ready).toEqual([])
  })

  it('limits visible items and reports the hidden count', () => {
    const items = Array.from({ length: 8 }, (_, index) =>
      makeItem({ queueNumber: index + 1 }),
    )
    const { visible, hiddenCount } = getVisibleQueue(items)

    expect(visible).toHaveLength(5)
    expect(visible.at(-1)?.queueNumber).toBe(5)
    expect(hiddenCount).toBe(3)
  })

  it('only announces ready orders that were not already visible', () => {
    expect(getNewReadyNumbers(null, [1, 2])).toEqual([])
    expect(getNewReadyNumbers(new Set([1, 2]), [1, 2, 3])).toEqual([3])
    expect(getNewReadyNumbers(new Set([1, 2, 3]), [1, 3])).toEqual([])
  })
})
