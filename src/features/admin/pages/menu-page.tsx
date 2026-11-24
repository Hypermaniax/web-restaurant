import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  adminApi,
  adminKeys,
  useCategories,
  useMenuItems,
  useModifierGroups,
} from '../api/admin-api'
import type { MenuItem } from '../api/types'
import { AdminErrorState } from '../components/admin-error-state'
import { MenuDeleteDialog } from '../components/menu-delete-dialog'
import { MenuDialog } from '../components/menu-dialog'
import { MenuEmptyState, MenuLoading } from '../components/menu-feedback'
import { MenuItemTable } from '../components/menu-item-table'
import { Pagination } from '../components/pagination'
import { PageHeader } from '../components/page-header'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { usePagination } from '../hooks/use-pagination'
import { getErrorMessage } from '../lib/errors'

export function MenuPage() {
  const { page, pageSize, paginationProps } = usePagination()
  const menuQuery = useMenuItems(true, page, pageSize)
  const categoriesQuery = useCategories(true)
  const modifierGroupsQuery = useModifierGroups(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [deleting, setDeleting] = useState<MenuItem | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const availabilityMutation = useAdminMutation({
    mutationFn: (input: { id: string; isAvailable: boolean }) =>
      adminApi.menu.update(input.id, { isAvailable: input.isAvailable }),
    successMessage: 'Ketersediaan diperbarui',
    invalidateKeys: [adminKeys.menu],
  })

  const removeMutation = useAdminMutation({
    mutationFn: (item: MenuItem) => adminApi.menu.remove(item.id),
    successMessage: 'Menu dinonaktifkan',
    invalidateKeys: [adminKeys.menu],
    onSuccess: () => setDeleting(null),
  })

  function openCreate() {
    if (!categoriesQuery.data?.length) {
      toast.error('Buat kategori terlebih dahulu')
      return
    }
    setEditing(null)
    setImageFile(null)
    setFormOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setImageFile(null)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Katalog"
        title="Menu"
        description="Kelola item, harga, foto, modifier, dan ketersediaan menu."
        actions={
          <Button variant="accent" onClick={openCreate}>
            <Plus />
            Tambah menu
          </Button>
        }
      />

      {menuQuery.isLoading ? (
        <MenuLoading />
      ) : menuQuery.isError ? (
        <AdminErrorState
          title="Menu gagal dimuat"
          message={getErrorMessage(menuQuery.error)}
          onRetry={() => void menuQuery.refetch()}
        />
      ) : menuQuery.data && menuQuery.data.meta.total > 0 ? (
        <>
          {menuQuery.data.items.length > 0 ? (
            <MenuItemTable
              items={menuQuery.data.items}
              availabilityPending={availabilityMutation.isPending}
              onEdit={openEdit}
              onDelete={setDeleting}
              onAvailabilityChange={(item, isAvailable) =>
                availabilityMutation.mutate({ id: item.id, isAvailable })
              }
            />
          ) : null}
          <Pagination meta={menuQuery.data.meta} {...paginationProps} />
        </>
      ) : (
        <MenuEmptyState onCreate={openCreate} />
      )}

      <MenuDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editing}
        categories={categoriesQuery.data ?? []}
        modifierGroups={modifierGroupsQuery.data ?? []}
        imageFile={imageFile}
        onImageFileChange={setImageFile}
      />

      <MenuDeleteDialog
        item={deleting}
        isPending={removeMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={removeMutation.mutate}
      />
    </div>
  )
}
