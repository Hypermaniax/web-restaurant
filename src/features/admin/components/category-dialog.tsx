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
import type { Category } from '../api/types'
import {
  categorySchema,
  emptyCategoryValues,
  toCategoryValues,
  type CategoryValues,
} from '../lib/category-form'
import { useDialogForm } from '../hooks/use-dialog-form'
import { CategoryFields } from './category-fields'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {
  const form = useDialogForm({
    open,
    entity: category,
    resolver: zodResolver(categorySchema),
    emptyValues: emptyCategoryValues,
    toValues: toCategoryValues,
  })

  const saveMutation = useAdminMutation({
    mutationFn: (values: CategoryValues) =>
      category
        ? adminApi.categories.update(category.id, values)
        : adminApi.categories.create(values),
    successMessage: category ? 'Kategori diperbarui' : 'Kategori dibuat',
    invalidateKeys: [adminKeys.categories],
    onSuccess: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Ubah kategori' : 'Tambah kategori'}
          </DialogTitle>
          <DialogDescription>
            Nama kategori akan tampil sebagai bagian menu customer.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        >
          <CategoryFields form={form} />

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
