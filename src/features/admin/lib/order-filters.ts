import type {
  OrderFilters,
  OrderSource,
  OrderStatus,
  OrderType,
} from '../api/orders-api'

export const orderStatusOptions: Array<{ value: OrderStatus; label: string }> =
  [
    { value: 'PENDING_PAYMENT', label: 'Menunggu bayar' },
    { value: 'AWAITING_CASH', label: 'Bayar di kasir' },
    { value: 'PAID', label: 'Dibayar' },
    { value: 'PREPARING', label: 'Disiapkan' },
    { value: 'READY', label: 'Siap diambil' },
    { value: 'SERVED', label: 'Disajikan' },
    { value: 'CANCELLED', label: 'Dibatalkan' },
    { value: 'EXPIRED', label: 'Kedaluwarsa' },
  ]

export const orderTypeOptions: Array<{ value: OrderType; label: string }> = [
  { value: 'DINE_IN', label: 'Dine-in' },
  { value: 'TAKEAWAY', label: 'Takeaway' },
]

export const orderSourceOptions: Array<{ value: OrderSource; label: string }> =
  [
    { value: 'CUSTOMER_QR', label: 'QR meja' },
    { value: 'CASHIER', label: 'Kasir' },
    { value: 'ADMIN', label: 'Admin' },
  ]

export function setOrderFilter<K extends keyof OrderFilters>(
  filters: OrderFilters,
  key: K,
  value: OrderFilters[K] | 'all',
): OrderFilters {
  const next = { ...filters }
  if (value === 'all' || value === '') {
    delete next[key]
  } else {
    next[key] = value
  }
  return next
}
