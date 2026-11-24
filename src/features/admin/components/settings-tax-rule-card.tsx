import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface SettingsTaxRuleCardProps {
  title: string
  enabled: boolean
  rate: number
  rateError?: string
  onEnabledChange: (checked: boolean) => void
  registration: UseFormRegisterReturn
  idPrefix: string
}

export function SettingsTaxRuleCard({
  title,
  enabled,
  rate,
  rateError,
  onEnabledChange,
  registration,
  idPrefix,
}: SettingsTaxRuleCardProps) {
  return (
    <div className="border-pine/10 bg-muted/20 flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-muted-foreground text-xs">
            {enabled ? `Tarif ${rate}%` : 'Pajak nonaktif'}
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          aria-label={`Pajak ${title}`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-tax-rate`}>Tarif pajak (%)</Label>
        <Input
          id={`${idPrefix}-tax-rate`}
          type="number"
          min={0}
          max={100}
          step="0.01"
          disabled={!enabled}
          aria-invalid={Boolean(rateError)}
          {...registration}
        />
        {rateError ? (
          <p className="text-destructive text-sm">{rateError}</p>
        ) : null}
      </div>
    </div>
  )
}
