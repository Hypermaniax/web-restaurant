import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import { adminKeys } from './admin-api'
import type { OrderType, PaymentMethod } from './orders-api'

export type ReportType =
  'daily' | 'payments' | 'items' | 'tax' | 'cancellations'

export interface ReportOrderTypeRow {
  orderType: OrderType
  orderCount: number
  subtotal: number
  tax: number
  service: number
  discount: number
  revenue: number
}

export interface DailyReport {
  date: string
  orderCount: number
  subtotal: number
  tax: number
  service: number
  discount: number
  revenue: number
  orderTypes: ReportOrderTypeRow[]
}

export interface PaymentReportRow {
  orderType: OrderType
  paymentMethod: PaymentMethod
  orderCount: number
  amount: number
}

export interface PaymentReport {
  date: string
  totalAmount: number
  rows: PaymentReportRow[]
}

export interface ItemReportRow {
  menuItemId: string | null
  name: string
  qty: number
  revenue: number
}

export interface ItemReport {
  date: string
  totalQty: number
  totalRevenue: number
  rows: ItemReportRow[]
}

export interface TaxReportRow {
  orderType: OrderType
  orderCount: number
  taxAmount: number
}

export interface TaxReport {
  date: string
  totalTax: number
  rows: TaxReportRow[]
}

export interface CancellationReportRow {
  orderId: string
  orderNumber: string
  orderType: OrderType
  total: number
  reason: string | null
  cancelledAt: string | null
  cancelledByUserId: string | null
}

export interface CancellationReport {
  date: string
  count: number
  totalAmount: number
  rows: CancellationReportRow[]
}

function withDate(path: string, date?: string): string {
  return date ? `${path}?date=${encodeURIComponent(date)}` : path
}

export const reportsApi = {
  daily: (date?: string) =>
    apiRequest<DailyReport>(withDate('/admin/reports/daily', date)),
  payments: (date?: string) =>
    apiRequest<PaymentReport>(withDate('/admin/reports/payments', date)),
  items: (date?: string) => {
    const params = new URLSearchParams({ limit: '10' })
    if (date) params.set('date', date)
    return apiRequest<ItemReport>(`/admin/reports/items?${params.toString()}`)
  },
  tax: (date?: string) =>
    apiRequest<TaxReport>(withDate('/admin/reports/tax', date)),
  cancellations: (date?: string) =>
    apiRequest<CancellationReport>(
      withDate('/admin/reports/cancellations', date),
    ),
  exportPath: (type: ReportType, date?: string) => {
    const params = new URLSearchParams({ type })
    if (date) params.set('date', date)
    return `/admin/reports/export?${params.toString()}`
  },
}

export function useDailyReport(date?: string) {
  return useQuery({
    queryKey: [...adminKeys.reports, 'daily', date ?? 'today'],
    queryFn: () => reportsApi.daily(date),
  })
}

export function usePaymentReport(date?: string) {
  return useQuery({
    queryKey: [...adminKeys.reports, 'payments', date ?? 'today'],
    queryFn: () => reportsApi.payments(date),
  })
}

export function useItemReport(date?: string) {
  return useQuery({
    queryKey: [...adminKeys.reports, 'items', date ?? 'today'],
    queryFn: () => reportsApi.items(date),
  })
}

export function useTaxReport(date?: string) {
  return useQuery({
    queryKey: [...adminKeys.reports, 'tax', date ?? 'today'],
    queryFn: () => reportsApi.tax(date),
  })
}

export function useCancellationReport(date?: string) {
  return useQuery({
    queryKey: [...adminKeys.reports, 'cancellations', date ?? 'today'],
    queryFn: () => reportsApi.cancellations(date),
  })
}
