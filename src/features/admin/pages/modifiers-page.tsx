import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { adminApi, adminKeys, useModifierGroupsPage } from '../api/admin-api'
import type { ModifierGroup, ModifierOption } from '../api/types'
import { ConfirmDialog } from '../components/confirm-dialog'
import { EmptyState } from '../components/empty-state'
import { ModifierGroupCard } from '../components/modifier-group-card'
import { ModifierGroupDialog } from '../components/modifier-group-dialog'
import { ModifiersLoading } from '../components/modifiers-loading'
import { ModifierOptionDialog } from '../components/modifier-option-dialog'
import { Pagination } from '../components/pagination'
import { PageHeader } from '../components/page-header'
import { getErrorMessage } from '../lib/errors'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { usePagination } from '../hooks/use-pagination'

export function ModifiersPage() {
  const { page, pageSize, paginationProps } = usePagination()
  const { data, isLoading, isError, error, refetch } = useModifierGroupsPage(
    true,
    page,
    pageSize,
  )
  const [groupOpen, setGroupOpen] = useState(false)
  const [optionOpen, setOptionOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null)
  const [editingOption, setEditingOption] = useState<ModifierOption | null>(
    null,
  )
  const [optionGroup, setOptionGroup] = useState<ModifierGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<ModifierGroup | null>(null)
  const [deletingOption, setDeletingOption] = useState<ModifierOption | null>(
    null,
  )

  const removeGroup = useAdminMutation({
    mutationFn: (group: ModifierGroup) =>
      adminApi.modifiers.removeGroup(group.id),
    successMessage: 'Grup modifier dinonaktifkan',
    invalidateKeys: [adminKeys.modifiers],
    onSuccess: () => setDeletingGroup(null),
  })

  const removeOption = useAdminMutation({
    mutationFn: (option: ModifierOption) =>
      adminApi.modifiers.removeOption(option.id),
    successMessage: 'Opsi modifier dinonaktifkan',
    invalidateKeys: [adminKeys.modifiers],
    onSuccess: () => setDeletingOption(null),
  })

  function openCreateGroup() {
    setEditingGroup(null)
    setGroupOpen(true)
  }

  function openEditGroup(group: ModifierGroup) {
    setEditingGroup(group)
    setGroupOpen(true)
  }

  function openCreateOption(group: ModifierGroup) {
    setOptionGroup(group)
    setEditingOption(null)
    setOptionOpen(true)
  }

  function openEditOption(group: ModifierGroup, option: ModifierOption) {
    setOptionGroup(group)
    setEditingOption(option)
    setOptionOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Katalog"
        title="Modifier"
        description="Buat pilihan tambahan seperti level pedas, topping, atau ukuran."
        actions={
          <Button variant="accent" onClick={openCreateGroup}>
            <Plus />
            Tambah grup
          </Button>
        }
      />

      {isLoading ? (
        <ModifiersLoading />
      ) : isError ? (
        <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6">
          <p className="text-destructive font-semibold">
            Modifier gagal dimuat
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {getErrorMessage(error)}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => void refetch()}
          >
            Coba lagi
          </Button>
        </div>
      ) : data && data.meta.total > 0 ? (
        <>
          {data.items.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.items.map((group) => (
                <ModifierGroupCard
                  key={group.id}
                  group={group}
                  onEditGroup={openEditGroup}
                  onCreateOption={openCreateOption}
                  onEditOption={openEditOption}
                  onDeleteGroup={setDeletingGroup}
                  onDeleteOption={setDeletingOption}
                />
              ))}
            </div>
          ) : null}
          <Pagination meta={data.meta} {...paginationProps} />
        </>
      ) : (
        <EmptyState
          title="Belum ada modifier"
          description="Buat grup modifier pertama untuk pilihan tambahan di menu."
          action={
            <Button variant="accent" onClick={openCreateGroup}>
              <Plus />
              Tambah grup
            </Button>
          }
        />
      )}

      <ModifierGroupDialog
        open={groupOpen}
        onOpenChange={setGroupOpen}
        group={editingGroup}
      />
      <ModifierOptionDialog
        open={optionOpen}
        onOpenChange={setOptionOpen}
        group={optionGroup}
        option={editingOption}
      />

      <ConfirmDialog
        open={Boolean(deletingGroup)}
        onOpenChange={(open) => {
          if (!open) setDeletingGroup(null)
        }}
        title="Nonaktifkan grup modifier?"
        description={
          deletingGroup
            ? `Grup “${deletingGroup.name}” tidak akan dipakai di menu.`
            : ''
        }
        confirmLabel="Nonaktifkan"
        isPending={removeGroup.isPending}
        onConfirm={() => {
          if (deletingGroup) removeGroup.mutate(deletingGroup)
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingOption)}
        onOpenChange={(open) => {
          if (!open) setDeletingOption(null)
        }}
        title="Nonaktifkan opsi?"
        description={
          deletingOption
            ? `Opsi “${deletingOption.name}” tidak akan tampil di modifier.`
            : ''
        }
        confirmLabel="Nonaktifkan"
        isPending={removeOption.isPending}
        onConfirm={() => {
          if (deletingOption) removeOption.mutate(deletingOption)
        }}
      />
    </div>
  )
}
