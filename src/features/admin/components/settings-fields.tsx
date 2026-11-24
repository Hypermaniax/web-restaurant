import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatCurrency } from '@/lib/format'

interface SettingsSwitchRowProps {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function SettingsSwitchRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: SettingsSwitchRowProps) {
  return (
    <div className="border-border bg-muted/35 flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

interface SettingsNumberFieldProps {
  id: string
  label: string
  step?: string
  error?: string
  registration: UseFormRegisterReturn
}

export function SettingsNumberField({
  id,
  label,
  step,
  error,
  registration,
}: SettingsNumberFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={0}
        step={step}
        aria-invalid={Boolean(error)}
        {...registration}
      />
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  )
}

export function SettingsPreviewRow({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="text-muted-foreground flex items-center justify-between">
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  )
}
