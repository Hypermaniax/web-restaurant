import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  adminApi,
  adminKeys,
  useCategories,
  useMenuItems,
  useModifierGroups,
} from '../api/admin-api'
import type { MenuItem } from '../api/types'
import { ConfirmDialog } from '../components/confirm-dialog'
import { DataTableSkeleton } from '../components/data-table-skeleton'
import { EmptyState } from '../components/empty-state'
import { MenuDialog } from '../components/menu-dialog'
import { MenuItemTable } from '../components/menu-item-table'
import { Pagination } from '../components/pagination'
import { PageHeader } from '../components/page-header'
import { getErrorMessage } from '../lib/errors'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { toast } from 'sonner'
import { usePagination } from '../hooks/use-pagination'

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
        <DataTableSkeleton
          columns={['Menu', 'Kategori', 'Harga', 'Tersedia', 'Status', 'Aksi']}
          leading
        />
      ) : menuQuery.isError ? (
        <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6">
          <p className="text-destructive font-semibold">Menu gagal dimuat</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {getErrorMessage(menuQuery.error)}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => void menuQuery.refetch()}
          >
            Coba lagi
          </Button>
        </div>
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
        <EmptyState
          title="Belum ada menu"
          description="Tambahkan menu pertama, lengkapi harga, foto, dan modifier bila perlu."
          action={
            <Button variant="accent" onClick={openCreate}>
              <Plus />
              Tambah menu
            </Button>
          }
        />
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

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Nonaktifkan menu?"
        description={
          deleting
            ? `Menu “${deleting.name}” tidak akan tampil di katalog customer.`
            : ''
        }
        confirmLabel="Nonaktifkan"
        isPending={removeMutation.isPending}
        onConfirm={() => {
          if (deleting) removeMutation.mutate(deleting)
        }}
      />
    </div>
  )
}
