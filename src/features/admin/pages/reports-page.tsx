import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDateTime } from '@/lib/format'
import {
  useCancellationReport,
  useDailyReport,
  useItemReport,
  usePaymentReport,
  useTaxReport,
  type ReportType,
} from '../api/reports-api'
import { EmptyState } from '../components/empty-state'
import { ReportCard, ReportErrorCard } from '../components/report-card'
import { ReportDailyTab } from '../components/report-daily-tab'
import { ReportMetric } from '../components/report-metric'
import { ReportMetricsLoading } from '../components/report-metrics-loading'
import { ReportTable } from '../components/report-table'
import { ReportsHeader } from '../components/reports-header'
import { useReportExport } from '../hooks/use-report-export'
import { getErrorMessage } from '../lib/errors'
import { getOrderTypeLabel, getPaymentMethodLabel } from '../lib/orders'
import { todayJakarta } from '../lib/reports'

export function ReportsPage() {
  const [date, setDate] = useState(todayJakarta)
  const [exportType, setExportType] = useState<ReportType>('daily')
  const { isExporting, exportCsv } = useReportExport(date, exportType)
  const daily = useDailyReport(date)
  const payments = usePaymentReport(date)
  const items = useItemReport(date)
  const tax = useTaxReport(date)
  const cancellations = useCancellationReport(date)

  return (
    <div className="flex flex-col gap-6">
      <ReportsHeader
        date={date}
        exportType={exportType}
        isExporting={isExporting}
        onDateChange={setDate}
        onExportTypeChange={setExportType}
        onExport={() => void exportCsv()}
      />

      {daily.isLoading ? (
        <ReportMetricsLoading />
      ) : daily.isError ? (
        <ReportErrorCard
          title="Laporan gagal dimuat"
          message={getErrorMessage(daily.error)}
          onRetry={() => void daily.refetch()}
        />
      ) : daily.data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <ReportMetric
              label="Omzet"
              value={formatCurrency(daily.data.revenue)}
              accent
            />
            <ReportMetric label="Order" value={daily.data.orderCount} />
            <ReportMetric
              label="Pajak"
              value={formatCurrency(daily.data.tax)}
            />
            <ReportMetric
              label="Service"
              value={formatCurrency(daily.data.service)}
            />
            <ReportMetric
              label="Diskon"
              value={formatCurrency(daily.data.discount)}
            />
          </div>

          <Tabs defaultValue="daily" className="gap-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="daily">Ringkasan</TabsTrigger>
              <TabsTrigger value="payments">Pembayaran</TabsTrigger>
              <TabsTrigger value="tax">Pajak</TabsTrigger>
              <TabsTrigger value="cancellations">Pembatalan</TabsTrigger>
              <TabsTrigger value="items">Item terlaris</TabsTrigger>
            </TabsList>

            <ReportDailyTab report={daily.data} />

            <TabsContent value="payments">
              <ReportCard
                title="Rekap metode bayar"
                description={`Total pembayaran ${formatCurrency(payments.data?.totalAmount ?? 0)}.`}
                isLoading={payments.isLoading}
                isError={payments.isError}
                error={payments.error}
                onRetry={() => void payments.refetch()}
              >
                {payments.data && payments.data.rows.length > 0 ? (
                  <ReportTable
                    headers={[
                      'Tipe order',
                      'Metode',
                      'Jumlah order',
                      'Nominal',
                    ]}
                    rows={payments.data.rows.map((row) => [
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

            <TabsContent value="tax">
              <ReportCard
                title="Pajak terkumpul"
                description={`Total pajak ${formatCurrency(tax.data?.totalTax ?? 0)}.`}
                isLoading={tax.isLoading}
                isError={tax.isError}
                error={tax.error}
                onRetry={() => void tax.refetch()}
              >
                {tax.data && tax.data.rows.length > 0 ? (
                  <ReportTable
                    headers={['Tipe order', 'Jumlah order', 'Pajak']}
                    rows={tax.data.rows.map((row) => [
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

            <TabsContent value="cancellations">
              <ReportCard
                title="Order unpaid yang dibatalkan"
                description={`${cancellations.data?.count ?? 0} order · ${formatCurrency(cancellations.data?.totalAmount ?? 0)}.`}
                isLoading={cancellations.isLoading}
                isError={cancellations.isError}
                error={cancellations.error}
                onRetry={() => void cancellations.refetch()}
              >
                {cancellations.data && cancellations.data.rows.length > 0 ? (
                  <ReportTable
                    headers={['Order', 'Tipe', 'Total', 'Alasan', 'Waktu']}
                    rows={cancellations.data.rows.map((row) => [
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

            <TabsContent value="items">
              <ReportCard
                title="Item terlaris"
                description={`${items.data?.totalQty ?? 0} item terjual · ${formatCurrency(items.data?.totalRevenue ?? 0)}.`}
                isLoading={items.isLoading}
                isError={items.isError}
                error={items.error}
                onRetry={() => void items.refetch()}
              >
                {items.data && items.data.rows.length > 0 ? (
                  <ReportTable
                    headers={['Item', 'Qty', 'Omzet']}
                    rows={items.data.rows.map((row, index) => [
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
          </Tabs>
        </>
      ) : null}
    </div>
  )
}
