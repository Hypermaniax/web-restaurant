import { useState } from 'react'
import { toast } from 'sonner'
import { downloadFile } from '@/lib/download'
import { reportsApi, type ReportType } from '../api/reports-api'
import { getErrorMessage } from '../lib/errors'

export function useReportExport(date: string, exportType: ReportType) {
  const [isExporting, setIsExporting] = useState(false)

  async function exportCsv() {
    setIsExporting(true)
    try {
      await downloadFile(
        reportsApi.exportPath(exportType, date),
        `report-${exportType}-${date || 'hari-ini'}.csv`,
      )
      toast.success('CSV laporan diunduh')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsExporting(false)
    }
  }

  return { isExporting, exportCsv }
}
