import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type { Settings, TaxRule, WithMessage } from '../types'
import { adminKeys } from './keys'

export interface UpdateSettingsInput {
  taxInclusive?: boolean
  taxBaseIncludesService?: boolean
  serviceRateBp?: number
  requirePaymentBeforeKitchen?: boolean
  orderExpiryMinutes?: number
  cashExpiryMinutes?: number
  receiptFooter?: string | null
}

export interface UpdateTaxRuleInput {
  isEnabled: boolean
  rateBp: number
}

export const settingsApi = {
  get: () => apiRequest<Settings>('/admin/settings'),
  update: (input: UpdateSettingsInput) =>
    apiRequest<WithMessage<Settings>>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  taxRules: () => apiRequest<TaxRule[]>('/admin/tax-rules'),
  updateTaxRule: (orderType: TaxRule['orderType'], input: UpdateTaxRuleInput) =>
    apiRequest<WithMessage<TaxRule>>(`/admin/tax-rules/${orderType}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
}

export function useSettings() {
  return useQuery({
    queryKey: adminKeys.settings,
    queryFn: settingsApi.get,
  })
}

export function useTaxRules() {
  return useQuery({
    queryKey: adminKeys.taxRules,
    queryFn: settingsApi.taxRules,
  })
}
