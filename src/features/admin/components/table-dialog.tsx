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
import type { Table } from '../api/types'
import { useDialogForm } from '../hooks/use-dialog-form'
import {
  emptyTableValues,
  tableSchema,
  toTableInput,
  toTableValues,
  type TableValues,
} from '../lib/table-form'
import { TableFields } from './table-fields'

interface TableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table | null
}

export function TableDialog({ open, onOpenChange, table }: TableDialogProps) {
  const form = useDialogForm({
    open,
    entity: table,
    resolver: zodResolver(tableSchema),
    emptyValues: emptyTableValues,
    toValues: toTableValues,
  })

  const saveMutation = useAdminMutation({
    mutationFn: (values: TableValues) => {
      const payload = toTableInput(values)
      return table
        ? adminApi.tables.update(table.id, payload)
        : adminApi.tables.create(payload)
    },
    successMessage: table ? 'Meja diperbarui' : 'Meja dibuat',
    invalidateKeys: [adminKeys.tables],
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{table ? 'Ubah meja' : 'Tambah meja'}</DialogTitle>
          <DialogDescription>
            Kode meja dipakai di URL QR: `/t/&lt;kode&gt;`.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        >
          <TableFields form={form} />

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
