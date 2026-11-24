import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { adminApi, adminKeys } from '../api/admin-api'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import type { ModifierGroup } from '../api/types'
import { useDialogForm } from '../hooks/use-dialog-form'
import {
  emptyModifierGroup,
  modifierGroupSchema,
  toModifierGroupValues,
  type ModifierGroupValues,
} from '../lib/modifier-form'
import { ModifierGroupFields } from './modifier-group-fields'

interface ModifierGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: ModifierGroup | null
}

export function ModifierGroupDialog({
  open,
  onOpenChange,
  group,
}: ModifierGroupDialogProps) {
  const form = useDialogForm({
    open,
    entity: group,
    resolver: zodResolver(modifierGroupSchema),
    emptyValues: emptyModifierGroup,
    toValues: toModifierGroupValues,
  })

  const saveGroup = useAdminMutation({
    mutationFn: (values: ModifierGroupValues) =>
      group
        ? adminApi.modifiers.updateGroup(group.id, values)
        : adminApi.modifiers.createGroup(values),
    successMessage: group ? 'Grup modifier diperbarui' : 'Grup modifier dibuat',
    invalidateKeys: [adminKeys.modifiers],
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {group ? 'Ubah grup modifier' : 'Tambah grup modifier'}
          </DialogTitle>
          <DialogDescription>
            Tentukan aturan pilihan dan status grup.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit((values) => saveGroup.mutate(values))}
        >
          <ModifierGroupFields form={form} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saveGroup.isPending}>
              {saveGroup.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
