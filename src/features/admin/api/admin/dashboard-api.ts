import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type { DashboardSummary } from '../types'
import { adminKeys } from './keys'

export const dashboardApi = {
  get: () => apiRequest<DashboardSummary>('/cashier/dashboard'),
}

export function useDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: dashboardApi.get,
  })
}
