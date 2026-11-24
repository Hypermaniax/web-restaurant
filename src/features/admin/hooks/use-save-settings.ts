import { adminApi, adminKeys } from '../api/admin-api'
import { useAdminMutation } from './use-admin-mutation'
import {
  toSettingsUpdateInput,
  toTaxRuleInput,
  type SettingsValues,
} from '../lib/settings-form'

async function saveSettings(values: SettingsValues) {
  await adminApi.settings.update(toSettingsUpdateInput(values))

  await Promise.all([
    adminApi.settings.updateTaxRule(
      'DINE_IN',
      toTaxRuleInput(values, 'DINE_IN'),
    ),
    adminApi.settings.updateTaxRule(
      'TAKEAWAY',
      toTaxRuleInput(values, 'TAKEAWAY'),
    ),
  ])
}

export function useSaveSettings() {
  return useAdminMutation({
    mutationFn: saveSettings,
    successMessage: 'Pengaturan disimpan',
    invalidateKeys: [adminKeys.settings, adminKeys.taxRules],
  })
}
