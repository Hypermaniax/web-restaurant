import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { ModifierGroup } from '../api/types'
import type { MenuValues } from '../lib/menu-form'

interface MenuModifierPickerProps {
  form: UseFormReturn<MenuValues>
  modifierGroups: ModifierGroup[]
}

export function MenuModifierPicker({
  form,
  modifierGroups,
}: MenuModifierPickerProps) {
  const selectedModifierGroups = useWatch({
    control: form.control,
    name: 'modifierGroupIds',
  })

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>Modifier</Label>
        <p className="text-muted-foreground text-sm">
          Pilih grup modifier yang berlaku untuk menu ini.
        </p>
      </div>
      {modifierGroups.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {modifierGroups.map((group) => {
            const selected = selectedModifierGroups.includes(group.id)
            return (
              <div
                key={group.id}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5',
                  selected
                    ? 'border-pine/20 bg-mint/50'
                    : 'border-border bg-background',
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{group.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {group.isRequired ? 'Wajib' : 'Opsional'} ·{' '}
                    {group.options.length} opsi
                  </p>
                </div>
                <Switch
                  checked={selected}
                  aria-label={`Modifier ${group.name}`}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...selectedModifierGroups, group.id]
                      : selectedModifierGroups.filter((id) => id !== group.id)
                    form.setValue('modifierGroupIds', next)
                  }}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
          Belum ada modifier.{' '}
          <Link
            to="/admin/catalog/modifiers"
            className="text-chili font-semibold underline-offset-4 hover:underline"
          >
            Buat modifier
          </Link>
        </div>
      )}
    </div>
  )
}
