import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { createSchema, emptyCreate, type CreateValues } from '../lib/staff-form'
import { StaffCreateFields } from './staff-create-fields'

interface StaffCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffCreateDialog({
  open,
  onOpenChange,
}: StaffCreateDialogProps) {
  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: emptyCreate,
  })

  const createMutation = useAdminMutation({
    mutationFn: (values: CreateValues) => adminApi.staff.create(values),
    successMessage: 'Staff dibuat',
    invalidateKeys: [adminKeys.staff],
    onSuccess: () => {
      onOpenChange(false)
      form.reset(emptyCreate)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah staff</DialogTitle>
          <DialogDescription>
            Staff baru langsung bisa login sesuai role yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit((values) =>
            createMutation.mutate(values),
          )}
        >
          <StaffCreateFields form={form} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
