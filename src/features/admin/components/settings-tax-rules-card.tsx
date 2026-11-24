import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { SettingsValues } from '../lib/settings-form'
import { SettingsTaxRuleCard } from './settings-tax-rule-card'

interface SettingsTaxRulesCardProps {
  form: UseFormReturn<SettingsValues>
}

export function SettingsTaxRulesCard({ form }: SettingsTaxRulesCardProps) {
  const values = useWatch({ control: form.control })

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold">
          Pajak per tipe order
        </CardTitle>
        <CardDescription>
          Dine-in dan takeaway bisa memakai tarif berbeda.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <SettingsTaxRuleCard
          title="Dine-in"
          enabled={values.dineInTaxEnabled ?? false}
          rate={values.dineInTaxRate ?? 0}
          rateError={form.formState.errors.dineInTaxRate?.message}
          onEnabledChange={(checked) =>
            form.setValue('dineInTaxEnabled', checked)
          }
          registration={form.register('dineInTaxRate', {
            valueAsNumber: true,
          })}
          idPrefix="dine-in"
        />
        <SettingsTaxRuleCard
          title="Takeaway"
          enabled={values.takeawayTaxEnabled ?? false}
          rate={values.takeawayTaxRate ?? 0}
          rateError={form.formState.errors.takeawayTaxRate?.message}
          onEnabledChange={(checked) =>
            form.setValue('takeawayTaxEnabled', checked)
          }
          registration={form.register('takeawayTaxRate', {
            valueAsNumber: true,
          })}
          idPrefix="takeaway"
        />
      </CardContent>
    </Card>
  )
}
