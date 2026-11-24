import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { assetUrl } from '@/lib/assets'
import { adminApi, adminKeys } from '../api/admin-api'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import type { Category, MenuItem, ModifierGroup } from '../api/types'
import { useDialogForm } from '../hooks/use-dialog-form'
import {
  emptyMenuValues,
  menuSchema,
  toMenuInput,
  toMenuValues,
  type MenuValues,
} from '../lib/menu-form'
import { MenuFields } from './menu-fields'
import { MenuModifierPicker } from './menu-modifier-picker'
import { MenuStatusSwitches } from './menu-status-switches'

interface MenuDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem | null
  categories: Category[]
  modifierGroups: ModifierGroup[]
  imageFile: File | null
  onImageFileChange: (file: File | null) => void
}

export function MenuDialog({
  open,
  onOpenChange,
  item,
  categories,
  modifierGroups,
  imageFile,
  onImageFileChange,
}: MenuDialogProps) {
  const form = useDialogForm({
    open,
    entity: item,
    resolver: zodResolver(menuSchema),
    emptyValues: emptyMenuValues,
    toValues: toMenuValues,
  })
  const previewUrl = useMemo(
    () =>
      imageFile ? URL.createObjectURL(imageFile) : assetUrl(item?.imageUrl),
    [imageFile, item?.imageUrl],
  )

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const saveMutation = useAdminMutation({
    mutationFn: async (values: MenuValues) => {
      const payload = toMenuInput(values)
      const response = item
        ? await adminApi.menu.update(item.id, payload)
        : await adminApi.menu.create(payload)

      if (imageFile) {
        return adminApi.menu.uploadImage(response.id, imageFile)
      }

      return response
    },
    successMessage: item ? 'Menu diperbarui' : 'Menu dibuat',
    invalidateKeys: [adminKeys.menu],
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Ubah menu' : 'Tambah menu'}</DialogTitle>
          <DialogDescription>
            Data ini tampil di web customer. Total tetap dihitung server.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        >
          <MenuFields
            form={form}
            categories={categories}
            onImageFileChange={onImageFileChange}
            previewUrl={previewUrl}
          />
          <MenuStatusSwitches form={form} />
          <MenuModifierPicker form={form} modifierGroups={modifierGroups} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
