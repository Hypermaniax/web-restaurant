import { Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ReportType } from '../api/reports-api'
import { todayJakarta } from '../lib/reports'
import { PageHeader } from './page-header'

const exportOptions: Array<{ value: ReportType; label: string }> = [
  { value: 'daily', label: 'Ringkasan harian' },
  { value: 'payments', label: 'Pembayaran' },
  { value: 'items', label: 'Item terlaris' },
  { value: 'tax', label: 'Pajak' },
  { value: 'cancellations', label: 'Pembatalan' },
]

interface ReportsHeaderProps {
  date: string
  exportType: ReportType
  isExporting: boolean
  onDateChange: (date: string) => void
  onExportTypeChange: (type: ReportType) => void
  onExport: () => void
}

export function ReportsHeader({
  date,
  exportType,
  isExporting,
  onDateChange,
  onExportTypeChange,
  onExport,
}: ReportsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Operasional"
      title="Laporan"
      description="Omzet, pembayaran, pajak, pembatalan, dan item terlaris dari data yang sudah dibayar."
      actions={
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="report-date" className="text-xs">
              Tanggal bisnis
            </Label>
            <Input
              id="report-date"
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="w-40"
            />
          </div>
          <Button
            variant="outline"
            aria-label="Kembali ke hari ini"
            onClick={() => onDateChange(todayJakarta())}
          >
            <RotateCcw />
            Hari ini
          </Button>
          <div className="flex flex-col gap-1">
            <Label htmlFor="report-export" className="text-xs">
              Jenis CSV
            </Label>
            <Select
              value={exportType}
              onValueChange={(value) => onExportTypeChange(value as ReportType)}
            >
              <SelectTrigger id="report-export" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="accent" disabled={isExporting} onClick={onExport}>
            <Download />
            {isExporting ? 'Mengunduh...' : 'Export CSV'}
          </Button>
        </div>
      }
    />
  )
}
