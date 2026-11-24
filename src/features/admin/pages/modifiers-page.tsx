import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminApi, adminKeys, useModifierGroupsPage } from '../api/admin-api'
import type { ModifierGroup, ModifierOption } from '../api/types'
import {
  ModifierGroupDeleteDialog,
  ModifierOptionDeleteDialog,
} from '../components/modifier-delete-dialogs'
import { ModifierGroupCard } from '../components/modifier-group-card'
import { ModifierGroupDialog } from '../components/modifier-group-dialog'
import {
  ModifiersEmpty,
  ModifiersError,
} from '../components/modifiers-feedback'
import { ModifiersLoading } from '../components/modifiers-loading'
import { ModifierOptionDialog } from '../components/modifier-option-dialog'
import { Pagination } from '../components/pagination'
import { PageHeader } from '../components/page-header'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { useModifierDialogs } from '../hooks/use-modifier-dialogs'
import { usePagination } from '../hooks/use-pagination'
import { getErrorMessage } from '../lib/errors'

export function ModifiersPage() {
  const { page, pageSize, paginationProps } = usePagination()
  const { data, isLoading, isError, error, refetch } = useModifierGroupsPage(
    true,
    page,
    pageSize,
  )
  const dialogs = useModifierDialogs()

  const removeGroup = useAdminMutation({
    mutationFn: (group: ModifierGroup) =>
      adminApi.modifiers.removeGroup(group.id),
    successMessage: 'Grup modifier dinonaktifkan',
    invalidateKeys: [adminKeys.modifiers],
    onSuccess: () => dialogs.setDeletingGroup(null),
  })

  const removeOption = useAdminMutation({
    mutationFn: (option: ModifierOption) =>
      adminApi.modifiers.removeOption(option.id),
    successMessage: 'Opsi modifier dinonaktifkan',
    invalidateKeys: [adminKeys.modifiers],
    onSuccess: () => dialogs.setDeletingOption(null),
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Katalog"
        title="Modifier"
        description="Buat pilihan tambahan seperti level pedas, topping, atau ukuran."
        actions={
          <Button variant="accent" onClick={dialogs.openCreateGroup}>
            <Plus />
            Tambah grup
          </Button>
        }
      />

      {isLoading ? (
        <ModifiersLoading />
      ) : isError ? (
        <ModifiersError
          message={getErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : data && data.meta.total > 0 ? (
        <>
          {data.items.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.items.map((group) => (
                <ModifierGroupCard
                  key={group.id}
                  group={group}
                  onEditGroup={dialogs.openEditGroup}
                  onCreateOption={dialogs.openCreateOption}
                  onEditOption={dialogs.openEditOption}
                  onDeleteGroup={dialogs.setDeletingGroup}
                  onDeleteOption={dialogs.setDeletingOption}
                />
              ))}
            </div>
          ) : null}
          <Pagination meta={data.meta} {...paginationProps} />
        </>
      ) : (
        <ModifiersEmpty onCreate={dialogs.openCreateGroup} />
      )}

      <ModifierGroupDialog
        open={dialogs.groupOpen}
        onOpenChange={dialogs.setGroupOpen}
        group={dialogs.editingGroup}
      />
      <ModifierOptionDialog
        open={dialogs.optionOpen}
        onOpenChange={dialogs.setOptionOpen}
        group={dialogs.optionGroup}
        option={dialogs.editingOption}
      />

      <ModifierGroupDeleteDialog
        group={dialogs.deletingGroup}
        isPending={removeGroup.isPending}
        onClose={() => dialogs.setDeletingGroup(null)}
        onConfirm={removeGroup.mutate}
      />

      <ModifierOptionDeleteDialog
        option={dialogs.deletingOption}
        isPending={removeOption.isPending}
        onClose={() => dialogs.setDeletingOption(null)}
        onConfirm={removeOption.mutate}
      />
    </div>
  )
}
