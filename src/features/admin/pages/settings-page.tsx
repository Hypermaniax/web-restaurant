import { useSettings, useTaxRules } from '../api/admin-api'
import { AdminErrorState } from '../components/admin-error-state'
import { SettingsHeader } from '../components/settings-header'
import { SettingsLoading } from '../components/settings-loading'
import { SettingsPreviewCard } from '../components/settings-preview-card'
import {
  SettingsQrBaseCard,
  SettingsQrWarning,
} from '../components/settings-qr-card'
import { SettingsTaxCard } from '../components/settings-tax-card'
import { SettingsTaxRulesCard } from '../components/settings-tax-rules-card'
import { useSaveSettings } from '../hooks/use-save-settings'
import { useSettingsForm } from '../hooks/use-settings-form'
import { getErrorMessage } from '../lib/errors'

export function SettingsPage() {
  const settings = useSettings()
  const taxRules = useTaxRules()
  const form = useSettingsForm(settings.data, taxRules.data)
  const saveSettings = useSaveSettings()

  if (settings.isLoading || taxRules.isLoading) {
    return <SettingsLoading />
  }

  if (settings.isError || taxRules.isError) {
    return (
      <div className="flex flex-col gap-6">
        <SettingsHeader description="Pengaturan outlet gagal dimuat." />
        <AdminErrorState
          title="Gagal memuat pengaturan"
          message={getErrorMessage(settings.error ?? taxRules.error)}
          onRetry={() => {
            void settings.refetch()
            void taxRules.refetch()
          }}
        />
      </div>
    )
  }

  if (!settings.data) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader
        description="Atur pajak, service charge, expiry, dan footer struk. Perubahan hanya berlaku untuk order baru."
        showAdminBadge
      />

      <SettingsQrWarning qrBaseUrl={settings.data.qrBaseUrl} />

      <form
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]"
        onSubmit={form.handleSubmit((values) => saveSettings.mutate(values))}
      >
        <div className="flex flex-col gap-4">
          <SettingsTaxCard form={form} />
          <SettingsTaxRulesCard form={form} />
        </div>

        <div className="flex flex-col gap-4">
          <SettingsPreviewCard form={form} isSaving={saveSettings.isPending} />
          <SettingsQrBaseCard qrBaseUrl={settings.data.qrBaseUrl} />
        </div>
      </form>
    </div>
  )
}
