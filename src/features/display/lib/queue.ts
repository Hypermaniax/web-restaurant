import type {
  DisplayOrderStatus,
  DisplayOrderType,
  DisplayQueueItem,
  DisplayQueueView,
} from '../api/display-api'

export const MAX_VISIBLE_QUEUE = 5

const orderTypes = new Set<DisplayOrderType>(['DINE_IN', 'TAKEAWAY'])
const orderStatuses = new Set<DisplayOrderStatus>([
  'PAID',
  'PREPARING',
  'READY',
  'SERVED',
  'CANCELLED',
  'EXPIRED',
])
const preparingStatuses = new Set<DisplayOrderStatus>(['PAID', 'PREPARING'])

export function formatQueueNumber(queueNumber: number): string {
  return `A-${String(queueNumber).padStart(3, '0')}`
}

export function getOrderTypeLabel(orderType: DisplayOrderType): string {
  return orderType === 'DINE_IN' ? 'Dine-in' : 'Takeaway'
}

export function getOrderMetaLabel(item: DisplayQueueItem): string {
  if (item.orderType === 'TAKEAWAY') {
    return 'Ambil di kasir'
  }
  return item.tableCode ? `Meja ${item.tableCode}` : 'Dine-in'
}

export function toQueueItem(value: unknown): DisplayQueueItem | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null
  }

  const record = value as Record<string, unknown>
  const queueNumber = record.queueNumber
  const orderType = record.orderType
  const status = record.status
  const tableCode = record.tableCode

  if (
    typeof queueNumber !== 'number' ||
    !Number.isInteger(queueNumber) ||
    queueNumber <= 0 ||
    typeof orderType !== 'string' ||
    !orderTypes.has(orderType as DisplayOrderType) ||
    typeof status !== 'string' ||
    !orderStatuses.has(status as DisplayOrderStatus) ||
    (tableCode !== null && typeof tableCode !== 'string')
  ) {
    return null
  }

  return {
    queueNumber,
    orderType: orderType as DisplayOrderType,
    tableCode: tableCode as string | null,
    status: status as DisplayOrderStatus,
  }
}

export function mergeQueueUpdate(
  view: DisplayQueueView,
  item: DisplayQueueItem,
): DisplayQueueView {
  const preparing = view.preparing.filter(
    (entry) => entry.queueNumber !== item.queueNumber,
  )
  const ready = view.ready.filter(
    (entry) => entry.queueNumber !== item.queueNumber,
  )

  if (preparingStatuses.has(item.status)) {
    preparing.push(item)
  } else if (item.status === 'READY') {
    ready.push(item)
  }

  return {
    preparing: preparing.sort((a, b) => a.queueNumber - b.queueNumber),
    ready: ready.sort((a, b) => a.queueNumber - b.queueNumber),
  }
}

export function getVisibleQueue(items: DisplayQueueItem[]) {
  return {
    visible: items.slice(0, MAX_VISIBLE_QUEUE),
    hiddenCount: Math.max(0, items.length - MAX_VISIBLE_QUEUE),
  }
}

export function getNewReadyNumbers(
  previous: Set<number> | null,
  next: number[],
): number[] {
  if (!previous) {
    return []
  }

  return next.filter((queueNumber) => !previous.has(queueNumber))
}
