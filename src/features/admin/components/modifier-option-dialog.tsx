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
import type { ModifierGroup, ModifierOption } from '../api/types'
import { useDialogForm } from '../hooks/use-dialog-form'
import {
  emptyModifierOption,
  modifierOptionSchema,
  toModifierOptionValues,
  type ModifierOptionValues,
} from '../lib/modifier-form'
import { ModifierOptionFields } from './modifier-option-fields'

interface ModifierOptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: ModifierGroup | null
  option: ModifierOption | null
}

export function ModifierOptionDialog({
  open,
  onOpenChange,
  group,
  option,
}: ModifierOptionDialogProps) {
  const form = useDialogForm({
    open,
    entity: option,
    resolver: zodResolver(modifierOptionSchema),
    emptyValues: emptyModifierOption,
    toValues: toModifierOptionValues,
  })

  const saveOption = useAdminMutation({
    mutationFn: (values: ModifierOptionValues) => {
      if (!group) {
        throw new Error('Grup modifier tidak ditemukan')
      }
      return option
        ? adminApi.modifiers.updateOption(option.id, values)
        : adminApi.modifiers.createOption(group.id, values)
    },
    successMessage: option ? 'Opsi diperbarui' : 'Opsi ditambahkan',
    invalidateKeys: [adminKeys.modifiers],
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{option ? 'Ubah opsi' : 'Tambah opsi'}</DialogTitle>
          <DialogDescription>
            {group ? `Grup: ${group.name}` : 'Opsi modifier'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit((values) => saveOption.mutate(values))}
        >
          <ModifierOptionFields form={form} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saveOption.isPending}>
              {saveOption.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
