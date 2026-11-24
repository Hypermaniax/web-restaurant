import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type {
  CreatedOrder,
  PaymentSimulation,
  PublicMenu,
  PublicPaymentStatus,
  QrisPayment,
  QuoteInputItem,
  QuoteTotals,
} from './types'

export const customerKeys = {
  menu: (tableCode: string) => ['customer', 'menu', tableCode] as const,
  quote: (tableCode: string, key: string) =>
    ['customer', 'quote', tableCode, key] as const,
  paymentStatus: (tableCode: string, orderId: string) =>
    ['customer', 'payment-status', tableCode, orderId] as const,
}

function tablePath(code: string): string {
  return `/public/tables/${encodeURIComponent(code)}`
}

export const customerApi = {
  menu: (tableCode: string) =>
    apiRequest<PublicMenu>(`${tablePath(tableCode)}/menu`, {
      skipAuth: true,
    }),
  quote: (tableCode: string, items: QuoteInputItem[]) =>
    apiRequest<QuoteTotals>('/public/orders/quote', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ tableCode, items }),
    }),
  createOrder: (
    tableCode: string,
    items: QuoteInputItem[],
    input: {
      customerName?: string | null
      customerEmail?: string | null
      notes?: string | null
      idempotencyKey: string
    },
  ) =>
    apiRequest<CreatedOrder>('/public/orders', {
      method: 'POST',
      skipAuth: true,
      headers: { 'Idempotency-Key': input.idempotencyKey },
      body: JSON.stringify({
        tableCode,
        items,
        customerName: input.customerName ?? null,
        customerEmail: input.customerEmail ?? null,
        notes: input.notes ?? null,
      }),
    }),
  payOnline: (tableCode: string, orderId: string) =>
    apiRequest<QrisPayment>(`/public/orders/${orderId}/pay-online`, {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ tableCode }),
    }),
  paymentStatus: (tableCode: string, orderId: string) => {
    const search = new URLSearchParams({ tableCode })
    return apiRequest<PublicPaymentStatus>(
      `/public/orders/${orderId}/payment-status?${search.toString()}`,
      { skipAuth: true },
    )
  },
  simulatePayment: (tableCode: string, orderId: string) =>
    apiRequest<PaymentSimulation>(
      `/public/orders/${orderId}/simulate-payment`,
      {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ tableCode }),
      },
    ),
}

export function usePublicMenu(tableCode: string) {
  return useQuery({
    queryKey: customerKeys.menu(tableCode),
    queryFn: () => customerApi.menu(tableCode),
    enabled: tableCode.length > 0,
    retry: false,
  })
}

export function useQuote(tableCode: string, items: QuoteInputItem[]) {
  const key = JSON.stringify(items)

  return useQuery({
    queryKey: customerKeys.quote(tableCode, key),
    queryFn: () => customerApi.quote(tableCode, items),
    enabled: tableCode.length > 0 && items.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 5_000,
    retry: false,
  })
}

export function usePaymentStatus(
  tableCode: string,
  orderId: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: customerKeys.paymentStatus(tableCode, orderId ?? ''),
    queryFn: () => customerApi.paymentStatus(tableCode, orderId ?? ''),
    enabled: enabled && Boolean(orderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'PAID' || status === 'CANCELLED' || status === 'EXPIRED') {
        return false
      }
      return 3_000
    },
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  })
}
