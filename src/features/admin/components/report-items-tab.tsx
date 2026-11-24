import type { UseQueryResult } from '@tanstack/react-query'
import { TabsContent } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/format'
import type { ItemReport } from '../api/reports-api'
import { EmptyState } from './empty-state'
import { ReportCard } from './report-card'
import { ReportTable } from './report-table'

interface ReportItemsTabProps {
  report: UseQueryResult<ItemReport>
}

export function ReportItemsTab({ report }: ReportItemsTabProps) {
  const rows = report.data?.rows ?? []

  return (
    <TabsContent value="items">
      <ReportCard
        title="Item terlaris"
        description={`${report.data?.totalQty ?? 0} item terjual · ${formatCurrency(report.data?.totalRevenue ?? 0)}.`}
        isLoading={report.isLoading}
        isError={report.isError}
        error={report.error}
        onRetry={() => void report.refetch()}
      >
        {rows.length > 0 ? (
          <ReportTable
            headers={['Item', 'Qty', 'Omzet']}
            rows={rows.map((row, index) => [
              `${index + 1}. ${row.name}`,
              row.qty,
              formatCurrency(row.revenue),
            ])}
          />
        ) : (
          <EmptyState
            title="Belum ada item terjual"
            description="Belum ada item terjual pada tanggal ini."
          />
        )}
      </ReportCard>
    </TabsContent>
  )
}
