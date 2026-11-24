import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'

export type DisplayOrderType = 'DINE_IN' | 'TAKEAWAY'

export type DisplayOrderStatus =
  'PAID' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED' | 'EXPIRED'

export interface DisplayQueueItem {
  queueNumber: number
  orderType: DisplayOrderType
  tableCode: string | null
  status: DisplayOrderStatus
}

export interface DisplayQueueView {
  preparing: DisplayQueueItem[]
  ready: DisplayQueueItem[]
}

export const displayKeys = {
  queue: ['display', 'queue'] as const,
}

export const displayApi = {
  queue: () =>
    apiRequest<DisplayQueueView>('/public/display/queue', {
      skipAuth: true,
    }),
}

export function useDisplayQueue(connected: boolean) {
  return useQuery({
    queryKey: displayKeys.queue,
    queryFn: displayApi.queue,
    refetchInterval: connected ? 20_000 : 5_000,
    refetchIntervalInBackground: true,
    refetchOnReconnect: true,
    staleTime: 0,
    retry: 2,
  })
}
