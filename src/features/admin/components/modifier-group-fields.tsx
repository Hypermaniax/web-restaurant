import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { SelectionType } from '../api/types'
import type { ModifierGroupValues } from '../lib/modifier-form'

interface ModifierGroupFieldsProps {
  form: UseFormReturn<ModifierGroupValues>
}

export function ModifierGroupFields({ form }: ModifierGroupFieldsProps) {
  const selectionType = useWatch({
    control: form.control,
    name: 'selectionType',
  })
  const isRequired = useWatch({ control: form.control, name: 'isRequired' })
  const isActive = useWatch({ control: form.control, name: 'isActive' })

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="group-name">Nama grup</Label>
        <Input
          id="group-name"
          placeholder="Contoh: Level Pedas"
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
          <Label>Tipe pilihan</Label>
          <Select
            value={selectionType}
            onValueChange={(value) =>
              form.setValue('selectionType', value as SelectionType)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="SINGLE">Pilih satu</SelectItem>
                <SelectItem value="MULTIPLE">Pilih banyak</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="group-order">Urutan</Label>
          <Input
            id="group-order"
            type="number"
            min={0}
            {...form.register('sortOrder', { valueAsNumber: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="group-min">Min pilih</Label>
          <Input
            id="group-min"
            type="number"
            min={0}
            max={100}
            {...form.register('minSelect', { valueAsNumber: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="group-max">Maks pilih</Label>
          <Input
            id="group-max"
            type="number"
            min={0}
            max={100}
            placeholder="Kosongkan jika tidak dibatasi"
            {...form.register('maxSelect', {
              setValueAs: (value) => (value === '' ? null : Number(value)),
            })}
          />
        </div>
      </div>

      <div className="bg-muted/30 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="group-required">Wajib dipilih</Label>
          <Switch
            id="group-required"
            checked={isRequired}
            onCheckedChange={(checked) => form.setValue('isRequired', checked)}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="group-active">Aktif</Label>
          <Switch
            id="group-active"
            checked={isActive}
            onCheckedChange={(checked) => form.setValue('isActive', checked)}
          />
        </div>
      </div>
    </>
  )
}
