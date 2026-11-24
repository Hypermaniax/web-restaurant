import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { TableValues } from '../lib/table-form'

interface TableFieldsProps {
  form: UseFormReturn<TableValues>
}

export function TableFields({ form }: TableFieldsProps) {
  const isActive = useWatch({ control: form.control, name: 'isActive' })

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="table-code">Kode meja</Label>
        <Input
          id="table-code"
          placeholder="T01"
          className="uppercase"
          aria-invalid={Boolean(form.formState.errors.code)}
          {...form.register('code', {
            setValueAs: (value) =>
              typeof value === 'string' ? value.toUpperCase() : value,
          })}
        />
        {form.formState.errors.code ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.code.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="table-name">Nama meja</Label>
        <Input
          id="table-name"
          placeholder="Meja 01"
          aria-invalid={Boolean(form.formState.errors.name)}
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="table-zone">Zona</Label>
        <Input
          id="table-zone"
          placeholder="Indoor"
          {...form.register('zone')}
        />
      </div>

      <div className="bg-muted/30 flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
        <div>
          <Label htmlFor="table-active">Aktif</Label>
          <p className="text-muted-foreground text-sm">
            QR bisa dipakai customer.
          </p>
        </div>
        <Switch
          id="table-active"
          checked={isActive}
          onCheckedChange={(checked) => form.setValue('isActive', checked)}
        />
      </div>
    </>
  )
}
