import type { UseQueryResult } from '@tanstack/react-query'
import { TabsContent } from '@/components/ui/tabs'
import { formatCurrency, formatDateTime } from '@/lib/format'
import type { CancellationReport } from '../api/reports-api'
import { getOrderTypeLabel } from '../lib/orders'
import { EmptyState } from './empty-state'
import { ReportCard } from './report-card'
import { ReportTable } from './report-table'

interface ReportCancellationsTabProps {
  report: UseQueryResult<CancellationReport>
}

export function ReportCancellationsTab({
  report,
}: ReportCancellationsTabProps) {
  const rows = report.data?.rows ?? []

  return (
    <TabsContent value="cancellations">
      <ReportCard
        title="Order unpaid yang dibatalkan"
        description={`${report.data?.count ?? 0} order · ${formatCurrency(report.data?.totalAmount ?? 0)}.`}
        isLoading={report.isLoading}
        isError={report.isError}
        error={report.error}
        onRetry={() => void report.refetch()}
      >
        {rows.length > 0 ? (
          <ReportTable
            headers={['Order', 'Tipe', 'Total', 'Alasan', 'Waktu']}
            rows={rows.map((row) => [
              row.orderNumber,
              getOrderTypeLabel(row.orderType),
              formatCurrency(row.total),
              row.reason ?? '-',
              row.cancelledAt ? formatDateTime(row.cancelledAt) : '-',
            ])}
          />
        ) : (
          <EmptyState
            title="Tidak ada pembatalan"
            description="Tidak ada order unpaid yang dibatalkan pada tanggal ini."
          />
        )}
      </ReportCard>
    </TabsContent>
  )
}
