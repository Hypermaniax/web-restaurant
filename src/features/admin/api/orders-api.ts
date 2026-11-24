import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { adminKeys } from './admin-api'
import type { PageResult, WithMessage } from './types'

export type OrderType = 'DINE_IN' | 'TAKEAWAY'
export type OrderSource = 'CUSTOMER_QR' | 'CASHIER' | 'ADMIN'
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'AWAITING_CASH'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'CANCELLED'
  | 'EXPIRED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
export type PaymentMethod = 'QRIS' | 'CASH' | 'EDC'
export type PaymentProvider = 'XENDIT' | 'CASHIER'

export interface OrderModifier {
  id: string
  modifierOptionId: string | null
  nameSnapshot: string
  priceDelta: number
  qty: number
}

export interface OrderItem {
  id: string
  menuItemId: string | null
  nameSnapshot: string
  unitPrice: number
  qty: number
  notes: string | null
  lineTotal: number
  modifiers: OrderModifier[]
}

export interface OrderPayment {
  id: string
  provider: PaymentProvider
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  paidAt: string | null
}

export interface Order {
  id: string
  orderNumber: string
  orderType: OrderType
  source: OrderSource
  status: OrderStatus
  paymentStatus: PaymentStatus
  table: {
    id: string
    code: string
    name: string
  } | null
  sessionId: string | null
  queueNumber: number | null
  queueDisplay: string | null
  customerName: string | null
  notes: string | null
  currency: string
  subtotal: number
  discountAmount: number
  serviceAmount: number
  taxAmount: number
  total: number
  taxInclusive: boolean
  taxBaseIncludesService: boolean
  taxRateBp: number
  serviceRateBp: number
  expiresAt: string
  paidAt: string | null
  preparingAt: string | null
  readyAt: string | null
  servedAt: string | null
  cancelledAt: string | null
  cancelReason: string | null
  createdAt: string
  items: OrderItem[]
  payments: OrderPayment[]
}

export interface OrderFilters {
  status?: OrderStatus
  orderType?: OrderType
  source?: OrderSource
  tableId?: string
  date?: string
  orderNumber?: string
}

function withQuery(
  filters: OrderFilters,
  page: number,
  pageSize: number,
): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }
  search.set('page', String(page))
  search.set('pageSize', String(pageSize))
  return `/cashier/orders?${search.toString()}`
}

export const ordersApi = {
  list: (filters: OrderFilters, page = 1, pageSize = 20) =>
    apiRequest<PageResult<Order>>(withQuery(filters, page, pageSize)),
  cancel: (id: string, reason: string) =>
    apiRequest<WithMessage<Order>>(`/cashier/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
}

export function useOrders(filters: OrderFilters, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminKeys.orders, filters, page, pageSize],
    queryFn: () => ordersApi.list(filters, page, pageSize),
    refetchInterval: page === 1 ? 15_000 : false,
  })
}

export function useCancelOrder() {
  return useAdminMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ordersApi.cancel(id, reason),
    successMessage: 'Order dibatalkan',
    invalidateKeys: [adminKeys.orders, adminKeys.dashboard],
  })
}
