import type {
  OrderSource,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '../api/orders-api'

const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Menunggu bayar',
  AWAITING_CASH: 'Bayar di kasir',
  PAID: 'Dibayar',
  PREPARING: 'Disiapkan',
  READY: 'Siap diambil',
  SERVED: 'Disajikan',
  CANCELLED: 'Dibatalkan',
  EXPIRED: 'Kedaluwarsa',
}

const orderStatusClass: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'border-marigold/40 bg-marigold/15 text-pine',
  AWAITING_CASH: 'border-marigold/40 bg-marigold/15 text-pine',
  PAID: 'border-pine/15 bg-mint text-pine',
  PREPARING: 'border-marigold/40 bg-marigold/15 text-pine',
  READY: 'border-pine/15 bg-mint text-pine',
  SERVED: 'border-pine/10 bg-pine/10 text-pine',
  CANCELLED: 'border-chili/30 bg-chili/10 text-chili',
  EXPIRED: 'border-pine/10 bg-muted text-muted-foreground',
}

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: 'Belum dibayar',
  PAID: 'Lunas',
  FAILED: 'Gagal',
  EXPIRED: 'Kedaluwarsa',
}

const orderTypeLabel: Record<OrderType, string> = {
  DINE_IN: 'Dine-in',
  TAKEAWAY: 'Takeaway',
}

const orderSourceLabel: Record<OrderSource, string> = {
  CUSTOMER_QR: 'QR meja',
  CASHIER: 'Kasir',
  ADMIN: 'Admin',
}

const paymentMethodLabel: Record<PaymentMethod, string> = {
  QRIS: 'QRIS',
  CASH: 'Tunai',
  EDC: 'EDC',
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return orderStatusLabel[status]
}

export function getOrderStatusClass(status: OrderStatus): string {
  return orderStatusClass[status]
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return paymentStatusLabel[status]
}

export function getOrderTypeLabel(type: OrderType): string {
  return orderTypeLabel[type]
}

export function getOrderSourceLabel(source: OrderSource): string {
  return orderSourceLabel[source]
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return paymentMethodLabel[method]
}

export function canCancelOrder(status: OrderStatus): boolean {
  return status === 'PENDING_PAYMENT' || status === 'AWAITING_CASH'
}
