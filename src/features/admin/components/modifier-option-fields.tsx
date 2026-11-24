import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { ModifierOptionValues } from '../lib/modifier-form'

interface ModifierOptionFieldsProps {
  form: UseFormReturn<ModifierOptionValues>
}

export function ModifierOptionFields({ form }: ModifierOptionFieldsProps) {
  const isDefault = useWatch({ control: form.control, name: 'isDefault' })
  const isActive = useWatch({ control: form.control, name: 'isActive' })

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="option-name">Nama opsi</Label>
        <Input
          id="option-name"
          placeholder="Contoh: Pedas sedang"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="option-price">Tambahan harga</Label>
          <Input
            id="option-price"
            type="number"
            min={0}
            {...form.register('priceDelta', { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="option-order">Urutan</Label>
          <Input
            id="option-order"
            type="number"
            min={0}
            {...form.register('sortOrder', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="bg-muted/30 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="option-default">Default</Label>
          <Switch
            id="option-default"
            checked={isDefault}
            onCheckedChange={(checked) => form.setValue('isDefault', checked)}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="option-active">Aktif</Label>
          <Switch
            id="option-active"
            checked={isActive}
            onCheckedChange={(checked) => form.setValue('isActive', checked)}
          />
        </div>
      </div>
    </>
  )
}
