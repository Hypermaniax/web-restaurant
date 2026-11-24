import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { MenuValues } from '../lib/menu-form'

interface MenuStatusSwitchesProps {
  form: UseFormReturn<MenuValues>
}

export function MenuStatusSwitches({ form }: MenuStatusSwitchesProps) {
  const isAvailable = useWatch({ control: form.control, name: 'isAvailable' })
  const isActive = useWatch({ control: form.control, name: 'isActive' })

  return (
    <div className="border-border bg-muted/30 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor="menu-available">Tersedia</Label>
          <p className="text-muted-foreground text-sm">
            Bisa dipesan customer.
          </p>
        </div>
        <Switch
          id="menu-available"
          checked={isAvailable}
          onCheckedChange={(checked) => form.setValue('isAvailable', checked)}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor="menu-active">Aktif</Label>
          <p className="text-muted-foreground text-sm">Tampil di katalog.</p>
        </div>
        <Switch
          id="menu-active"
          checked={isActive}
          onCheckedChange={(checked) => form.setValue('isActive', checked)}
        />
      </div>
    </div>
  )
}
