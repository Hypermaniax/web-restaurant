import { LockKeyhole } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSettings, useTaxRules } from '../api/admin-api'
import { EmptyState } from '../components/empty-state'
import { PageHeader } from '../components/page-header'
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
        <PageHeader
          eyebrow="Pengaturan"
          title="Pajak & service"
          description="Pengaturan outlet gagal dimuat."
        />
        <EmptyState
          title="Gagal memuat pengaturan"
          description={getErrorMessage(settings.error ?? taxRules.error)}
          action={
            <Button
              variant="outline"
              onClick={() => {
                void settings.refetch()
                void taxRules.refetch()
              }}
            >
              Coba lagi
            </Button>
          }
        />
      </div>
    )
  }

  if (!settings.data) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="Pajak & service"
        description="Atur pajak, service charge, expiry, dan footer struk. Perubahan hanya berlaku untuk order baru."
        actions={
          <Badge variant="outline" className="h-9 gap-2 px-3">
            <LockKeyhole />
            Admin only
          </Badge>
        }
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
