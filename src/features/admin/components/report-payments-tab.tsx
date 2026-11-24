import type { UseQueryResult } from '@tanstack/react-query'
import { TabsContent } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/format'
import type { PaymentReport } from '../api/reports-api'
import { getOrderTypeLabel, getPaymentMethodLabel } from '../lib/orders'
import { EmptyState } from './empty-state'
import { ReportCard } from './report-card'
import { ReportTable } from './report-table'

interface ReportPaymentsTabProps {
  report: UseQueryResult<PaymentReport>
}

export function ReportPaymentsTab({ report }: ReportPaymentsTabProps) {
  const rows = report.data?.rows ?? []

  return (
    <TabsContent value="payments">
      <ReportCard
        title="Rekap metode bayar"
        description={`Total pembayaran ${formatCurrency(report.data?.totalAmount ?? 0)}.`}
        isLoading={report.isLoading}
        isError={report.isError}
        error={report.error}
        onRetry={() => void report.refetch()}
      >
        {rows.length > 0 ? (
          <ReportTable
            headers={['Tipe order', 'Metode', 'Jumlah order', 'Nominal']}
            rows={rows.map((row) => [
              getOrderTypeLabel(row.orderType),
              getPaymentMethodLabel(row.paymentMethod),
              row.orderCount,
              formatCurrency(row.amount),
            ])}
          />
        ) : (
          <EmptyState
            title="Belum ada pembayaran"
            description="Belum ada pembayaran pada tanggal ini."
          />
        )}
      </ReportCard>
    </TabsContent>
  )
}
