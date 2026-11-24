import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/format'
import type { DailyReport } from '../api/reports-api'
import { getOrderTypeLabel } from '../lib/orders'
import { ReportTable } from './report-table'

interface ReportDailyTabProps {
  report: DailyReport
}

export function ReportDailyTab({ report }: ReportDailyTabProps) {
  return (
    <TabsContent value="daily">
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="font-display text-xl font-bold">
            Omzet per tipe order
          </CardTitle>
          <CardDescription>
            Tanggal bisnis {report.date}. Total berasal dari server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportTable
            headers={[
              'Tipe',
              'Order',
              'Subtotal',
              'Pajak',
              'Service',
              'Diskon',
              'Omzet',
            ]}
            rows={report.orderTypes.map((row) => [
              getOrderTypeLabel(row.orderType),
              row.orderCount,
              formatCurrency(row.subtotal),
              formatCurrency(row.tax),
              formatCurrency(row.service),
              formatCurrency(row.discount),
              formatCurrency(row.revenue),
            ])}
            footer={[
              'Total',
              report.orderCount,
              formatCurrency(report.subtotal),
              formatCurrency(report.tax),
              formatCurrency(report.service),
              formatCurrency(report.discount),
              formatCurrency(report.revenue),
            ]}
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
