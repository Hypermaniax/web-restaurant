import { useState } from 'react'
import { adminApi, adminKeys, useCategoriesPage } from '../api/admin-api'
import type { Category } from '../api/types'
import {
  CategoriesEmpty,
  CategoriesError,
  CategoriesLoading,
} from '../components/categories-feedback'
import { CategoriesHeader } from '../components/categories-header'
import { CategoryDialog } from '../components/category-dialog'
import { CategoryTable } from '../components/category-table'
import { Pagination } from '../components/pagination'
import { ConfirmDialog } from '../components/confirm-dialog'
import { getErrorMessage } from '../lib/errors'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { usePagination } from '../hooks/use-pagination'

export function CategoriesPage() {
  const { page, pageSize, paginationProps } = usePagination()
  const { data, isLoading, isError, error, refetch } = useCategoriesPage(
    true,
    page,
    pageSize,
  )
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const removeMutation = useAdminMutation({
    mutationFn: (category: Category) => adminApi.categories.remove(category.id),
    successMessage: 'Kategori dinonaktifkan',
    invalidateKeys: [adminKeys.categories],
    onSuccess: () => setDeleting(null),
  })

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <CategoriesHeader onCreate={openCreate} />

      {isLoading ? (
        <CategoriesLoading />
      ) : isError ? (
        <CategoriesError
          message={getErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : data && data.meta.total > 0 ? (
        <>
          {data.items.length > 0 ? (
            <CategoryTable
              categories={data.items}
              onEdit={openEdit}
              onDeactivate={setDeleting}
            />
          ) : null}
          <Pagination meta={data.meta} {...paginationProps} />
        </>
      ) : (
        <CategoriesEmpty onCreate={openCreate} />
      )}

      <CategoryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Nonaktifkan kategori?"
        description={
          deleting
            ? `Kategori “${deleting.name}” tidak akan tampil di menu customer.`
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
