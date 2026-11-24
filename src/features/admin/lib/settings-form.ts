import { z } from 'zod'
import type { UpdateSettingsInput, UpdateTaxRuleInput } from '../api/admin-api'
import type { Settings, TaxRule } from '../api/types'

export const settingsSchema = z.object({
  taxInclusive: z.boolean(),
  taxBaseIncludesService: z.boolean(),
  serviceRate: z.number().min(0, 'Minimal 0').max(100, 'Maksimal 100'),
  requirePaymentBeforeKitchen: z.boolean(),
  orderExpiryMinutes: z
    .number()
    .int('Harus bilangan bulat')
    .min(1, 'Minimal 1 menit')
    .max(1440, 'Maksimal 1440 menit'),
  cashExpiryMinutes: z
    .number()
    .int('Harus bilangan bulat')
    .min(1, 'Minimal 1 menit')
    .max(1440, 'Maksimal 1440 menit'),
  receiptFooter: z.string().max(500, 'Maksimal 500 karakter'),
  dineInTaxEnabled: z.boolean(),
  dineInTaxRate: z.number().min(0, 'Minimal 0').max(100, 'Maksimal 100'),
  takeawayTaxEnabled: z.boolean(),
  takeawayTaxRate: z.number().min(0, 'Minimal 0').max(100, 'Maksimal 100'),
})

export type SettingsValues = z.infer<typeof settingsSchema>

export const defaultSettingsValues: SettingsValues = {
  taxInclusive: false,
  taxBaseIncludesService: false,
  serviceRate: 0,
  requirePaymentBeforeKitchen: true,
  orderExpiryMinutes: 15,
  cashExpiryMinutes: 30,
  receiptFooter: '',
  dineInTaxEnabled: false,
  dineInTaxRate: 0,
  takeawayTaxEnabled: false,
  takeawayTaxRate: 0,
}

export function toSettingsFormValues(
  settings: Settings,
  taxRules: TaxRule[] | undefined,
): SettingsValues {
  const dineIn = taxRules?.find((rule) => rule.orderType === 'DINE_IN')
  const takeaway = taxRules?.find((rule) => rule.orderType === 'TAKEAWAY')

  return {
    taxInclusive: settings.taxInclusive,
    taxBaseIncludesService: settings.taxBaseIncludesService,
    serviceRate: settings.serviceRateBp / 100,
    requirePaymentBeforeKitchen: settings.requirePaymentBeforeKitchen,
    orderExpiryMinutes: settings.orderExpiryMinutes,
    cashExpiryMinutes: settings.cashExpiryMinutes,
    receiptFooter: settings.receiptFooter ?? '',
    dineInTaxEnabled: dineIn?.isEnabled ?? false,
    dineInTaxRate: (dineIn?.rateBp ?? 0) / 100,
    takeawayTaxEnabled: takeaway?.isEnabled ?? false,
    takeawayTaxRate: (takeaway?.rateBp ?? 0) / 100,
  }
}

export function toSettingsUpdateInput(
  values: SettingsValues,
): UpdateSettingsInput {
  return {
    taxInclusive: values.taxInclusive,
    taxBaseIncludesService: values.taxBaseIncludesService,
    serviceRateBp: Math.round(values.serviceRate * 100),
    requirePaymentBeforeKitchen: values.requirePaymentBeforeKitchen,
    orderExpiryMinutes: values.orderExpiryMinutes,
    cashExpiryMinutes: values.cashExpiryMinutes,
    receiptFooter: values.receiptFooter.trim() || null,
  }
}

export function toTaxRuleInput(
  values: SettingsValues,
  orderType: TaxRule['orderType'],
): UpdateTaxRuleInput {
  return orderType === 'DINE_IN'
    ? {
        isEnabled: values.dineInTaxEnabled,
        rateBp: Math.round(values.dineInTaxRate * 100),
      }
    : {
        isEnabled: values.takeawayTaxEnabled,
        rateBp: Math.round(values.takeawayTaxRate * 100),
      }
}
