import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { CategoryValues } from '../lib/category-form'

interface CategoryFieldsProps {
  form: UseFormReturn<CategoryValues>
}

export function CategoryFields({ form }: CategoryFieldsProps) {
  const isActive = useWatch({ control: form.control, name: 'isActive' })

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="category-name">Nama kategori</Label>
        <Input
          id="category-name"
          placeholder="Contoh: Makanan"
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
        <Label htmlFor="category-order">Urutan</Label>
        <Input
          id="category-order"
          type="number"
          min={0}
          aria-invalid={Boolean(form.formState.errors.sortOrder)}
          {...form.register('sortOrder', { valueAsNumber: true })}
        />
        {form.formState.errors.sortOrder ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.sortOrder.message}
          </p>
        ) : null}
      </div>

      <div className="border-border bg-muted/35 flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
        <div>
          <Label htmlFor="category-active">Aktif</Label>
          <p className="text-muted-foreground text-sm">
            Tampilkan kategori di menu.
          </p>
        </div>
        <Switch
          id="category-active"
          checked={isActive}
          onCheckedChange={(checked) => form.setValue('isActive', checked)}
        />
      </div>
    </>
  )
}
