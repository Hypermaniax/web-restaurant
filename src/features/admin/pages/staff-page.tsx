import { useState } from 'react'
import { useAuthStore } from '@/lib/auth/auth-store'
import { adminApi, adminKeys, useStaff } from '../api/admin-api'
import type { Staff } from '../api/types'
import { ConfirmDialog } from '../components/confirm-dialog'
import { Pagination } from '../components/pagination'
import { StaffCreateDialog } from '../components/staff-create-dialog'
import {
  StaffEmpty,
  StaffError,
  StaffLoading,
} from '../components/staff-feedback'
import { StaffHeader } from '../components/staff-header'
import { StaffPasswordDialog } from '../components/staff-password-dialog'
import { StaffTable } from '../components/staff-table'
import { getErrorMessage } from '../lib/errors'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { usePagination } from '../hooks/use-pagination'

export function StaffPage() {
  const { page, pageSize, paginationProps } = usePagination()
  const { data, isLoading, isError, error, refetch } = useStaff(page, pageSize)
  const currentUser = useAuthStore((state) => state.user)
  const [createOpen, setCreateOpen] = useState(false)
  const [resetTarget, setResetTarget] = useState<Staff | null>(null)
  const [deleting, setDeleting] = useState<Staff | null>(null)

  const deactivateMutation = useAdminMutation({
    mutationFn: (staff: Staff) => adminApi.staff.deactivate(staff.id),
    successMessage: 'Staff dinonaktifkan',
    invalidateKeys: [adminKeys.staff],
    onSuccess: () => setDeleting(null),
  })

  return (
    <div className="flex flex-col gap-6">
      <StaffHeader onCreate={() => setCreateOpen(true)} />

      {isLoading ? (
        <StaffLoading />
      ) : isError ? (
        <StaffError
          message={getErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : data && data.meta.total > 0 ? (
        <>
          {data.items.length > 0 ? (
            <StaffTable
              staff={data.items}
              currentUserId={currentUser?.id}
              onResetPassword={setResetTarget}
              onDeactivate={setDeleting}
            />
          ) : null}
          <Pagination meta={data.meta} {...paginationProps} />
        </>
      ) : (
        <StaffEmpty onCreate={() => setCreateOpen(true)} />
      )}

      <StaffCreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <StaffPasswordDialog
        staff={resetTarget}
        onOpenChange={(open) => {
          if (!open) setResetTarget(null)
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Nonaktifkan staff?"
        description={
          deleting ? `${deleting.name} tidak akan bisa login lagi.` : ''
        }
        confirmLabel="Nonaktifkan"
        isPending={deactivateMutation.isPending}
        onConfirm={() => {
          if (deleting) deactivateMutation.mutate(deleting)
        }}
      />
    </div>
  )
}
