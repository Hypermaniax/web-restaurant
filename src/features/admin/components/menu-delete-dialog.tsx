import type { MenuItem } from '../api/types'
import { ConfirmDialog } from './confirm-dialog'

interface MenuDeleteDialogProps {
  item: MenuItem | null
  isPending: boolean
  onClose: () => void
  onConfirm: (item: MenuItem) => void
}

export function MenuDeleteDialog({
  item,
  isPending,
  onClose,
  onConfirm,
}: MenuDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Nonaktifkan menu?"
      description={
        item ? `Menu “${item.name}” tidak akan tampil di katalog customer.` : ''
      }
      confirmLabel="Nonaktifkan"
      isPending={isPending}
      onConfirm={() => {
        if (item) onConfirm(item)
      }}
    />
  )
}
