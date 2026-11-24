import type { ModifierGroup, ModifierOption } from '../api/types'
import { ConfirmDialog } from './confirm-dialog'

interface ModifierGroupDeleteDialogProps {
  group: ModifierGroup | null
  isPending: boolean
  onClose: () => void
  onConfirm: (group: ModifierGroup) => void
}

export function ModifierGroupDeleteDialog({
  group,
  isPending,
  onClose,
  onConfirm,
}: ModifierGroupDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(group)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Nonaktifkan grup modifier?"
      description={
        group ? `Grup “${group.name}” tidak akan dipakai di menu.` : ''
      }
      confirmLabel="Nonaktifkan"
      isPending={isPending}
      onConfirm={() => {
        if (group) onConfirm(group)
      }}
    />
  )
}

interface ModifierOptionDeleteDialogProps {
  option: ModifierOption | null
  isPending: boolean
  onClose: () => void
  onConfirm: (option: ModifierOption) => void
}

export function ModifierOptionDeleteDialog({
  option,
  isPending,
  onClose,
  onConfirm,
}: ModifierOptionDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(option)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Nonaktifkan opsi?"
      description={
        option ? `Opsi “${option.name}” tidak akan tampil di modifier.` : ''
      }
      confirmLabel="Nonaktifkan"
      isPending={isPending}
      onConfirm={() => {
        if (option) onConfirm(option)
      }}
    />
  )
}
