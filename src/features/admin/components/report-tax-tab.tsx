import type { UseQueryResult } from '@tanstack/react-query'
import { TabsContent } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/format'
import type { TaxReport } from '../api/reports-api'
import { getOrderTypeLabel } from '../lib/orders'
import { EmptyState } from './empty-state'
import { ReportCard } from './report-card'
import { ReportTable } from './report-table'

interface ReportTaxTabProps {
  report: UseQueryResult<TaxReport>
}

export function ReportTaxTab({ report }: ReportTaxTabProps) {
  const rows = report.data?.rows ?? []

  return (
    <TabsContent value="tax">
      <ReportCard
        title="Pajak terkumpul"
        description={`Total pajak ${formatCurrency(report.data?.totalTax ?? 0)}.`}
        isLoading={report.isLoading}
        isError={report.isError}
        error={report.error}
        onRetry={() => void report.refetch()}
      >
        {rows.length > 0 ? (
          <ReportTable
            headers={['Tipe order', 'Jumlah order', 'Pajak']}
            rows={rows.map((row) => [
              getOrderTypeLabel(row.orderType),
              row.orderCount,
              formatCurrency(row.taxAmount),
            ])}
          />
        ) : (
          <EmptyState
            title="Belum ada pajak"
            description="Belum ada order dengan pajak pada tanggal ini."
          />
        )}
      </ReportCard>
    </TabsContent>
  )
}
