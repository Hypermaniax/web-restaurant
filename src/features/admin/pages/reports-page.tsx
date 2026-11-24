import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/format'
import {
  useCancellationReport,
  useDailyReport,
  useItemReport,
  usePaymentReport,
  useTaxReport,
  type ReportType,
} from '../api/reports-api'
import { ReportCancellationsTab } from '../components/report-cancellations-tab'
import { ReportDailyTab } from '../components/report-daily-tab'
import { ReportErrorCard } from '../components/report-card'
import { ReportItemsTab } from '../components/report-items-tab'
import { ReportMetric } from '../components/report-metric'
import { ReportMetricsLoading } from '../components/report-metrics-loading'
import { ReportPaymentsTab } from '../components/report-payments-tab'
import { ReportTaxTab } from '../components/report-tax-tab'
import { ReportsHeader } from '../components/reports-header'
import { useReportExport } from '../hooks/use-report-export'
import { getErrorMessage } from '../lib/errors'
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

            <ReportPaymentsTab report={payments} />
            <ReportTaxTab report={tax} />
            <ReportCancellationsTab report={cancellations} />
            <ReportItemsTab report={items} />
          </Tabs>
        </>
      ) : null}
    </div>
  )
}
