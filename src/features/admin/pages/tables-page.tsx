import { useState } from 'react'
import { downloadFile } from '@/lib/download'
import { adminApi, adminKeys, useSettings, useTables } from '../api/admin-api'
import type { Table } from '../api/types'
import { ConfirmDialog } from '../components/confirm-dialog'
import { Pagination } from '../components/pagination'
import { TableCard } from '../components/table-card'
import { TableDialog } from '../components/table-dialog'
import {
  TablesEmpty,
  TablesError,
  TablesLoading,
  TablesQrWarning,
} from '../components/tables-feedback'
import { TablesHeader } from '../components/tables-header'
import { getErrorMessage } from '../lib/errors'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import { isLocalQrUrl } from '../lib/table-form'
import { usePagination } from '../hooks/use-pagination'

export function TablesPage() {
  const { page, pageSize, paginationProps } = usePagination()
  const tablesQuery = useTables(true, page, pageSize)
  const settingsQuery = useSettings()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Table | null>(null)
  const [deleting, setDeleting] = useState<Table | null>(null)

  const removeMutation = useAdminMutation({
    mutationFn: (table: Table) => adminApi.tables.remove(table.id),
    successMessage: 'Meja dinonaktifkan',
    invalidateKeys: [adminKeys.tables],
    onSuccess: () => setDeleting(null),
  })

  const downloadPng = useAdminMutation({
    mutationFn: (table: Table) =>
      downloadFile(
        `/admin/tables/${table.id}/qr.png`,
        `qr-meja-${table.code}.png`,
      ),
    successMessage: 'QR PNG diunduh',
  })

  const downloadPdf = useAdminMutation({
    mutationFn: () =>
      downloadFile('/admin/tables/qr.pdf', 'kartu-qr-meja-rembuk.pdf'),
    successMessage: 'PDF kartu QR diunduh',
  })

  const qrBaseUrl = settingsQuery.data?.qrBaseUrl

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(table: Table) {
    setEditing(table)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <TablesHeader
        isDownloadingPdf={downloadPdf.isPending}
        onCreate={openCreate}
        onDownloadPdf={() => downloadPdf.mutate()}
      />

      {isLocalQrUrl(qrBaseUrl) && qrBaseUrl ? (
        <TablesQrWarning qrBaseUrl={qrBaseUrl} />
      ) : null}

      {tablesQuery.isLoading ? (
        <TablesLoading />
      ) : tablesQuery.isError ? (
        <TablesError
          message={getErrorMessage(tablesQuery.error)}
          onRetry={() => void tablesQuery.refetch()}
        />
      ) : tablesQuery.data && tablesQuery.data.meta.total > 0 ? (
        <>
          {tablesQuery.data.items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tablesQuery.data.items.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  qrBaseUrl={qrBaseUrl}
                  downloadPending={downloadPng.isPending}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                  onDownloadPng={downloadPng.mutate}
                />
              ))}
            </div>
          ) : null}
          <Pagination meta={tablesQuery.data.meta} {...paginationProps} />
        </>
      ) : (
        <TablesEmpty onCreate={openCreate} />
      )}

      <TableDialog open={formOpen} onOpenChange={setFormOpen} table={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Nonaktifkan meja?"
        description={
          deleting
            ? `QR meja ${deleting.code} tidak akan bisa dipakai customer.`
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
