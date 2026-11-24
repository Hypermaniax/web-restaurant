import { Download, MoreHorizontal, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Table } from '../api/types'

interface TableCardProps {
  table: Table
  qrBaseUrl: string | undefined
  downloadPending: boolean
  onEdit: (table: Table) => void
  onDelete: (table: Table) => void
  onDownloadPng: (table: Table) => void
}

export function TableCard({
  table,
  qrBaseUrl,
  downloadPending,
  onEdit,
  onDelete,
  onDownloadPng,
}: TableCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="bg-muted/25 border-b px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-display text-xl font-bold">
                {table.code}
              </CardTitle>
              <Badge
                variant={table.status === 'OCCUPIED' ? 'secondary' : 'outline'}
              >
                {table.status === 'OCCUPIED' ? 'Terisi' : 'Tersedia'}
              </Badge>
              {!table.isActive ? (
                <Badge variant="outline">Nonaktif</Badge>
              ) : null}
            </div>
            <CardDescription className="mt-1">
              {table.name}
              {table.zone ? ` · ${table.zone}` : ''}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Aksi ${table.code}`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(table)}>
                Ubah meja
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={downloadPending}
                onClick={() => onDownloadPng(table)}
              >
                Unduh QR PNG
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                disabled={!table.isActive}
                onClick={() => onDelete(table)}
              >
                Nonaktifkan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="border-pine/10 grid place-items-center rounded-2xl border bg-white p-4">
          {qrBaseUrl ? (
            <QRCodeSVG
              value={`${qrBaseUrl}/t/${table.code}`}
              size={152}
              level="M"
              marginSize={2}
              bgColor="#fffdf8"
              fgColor="#143c35"
            />
          ) : (
            <div className="text-muted-foreground grid size-[152px] place-items-center">
              <QrCode className="size-8" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {table.openSession
              ? 'Sesi meja sedang terbuka'
              : 'Belum ada sesi aktif'}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={downloadPending}
            onClick={() => onDownloadPng(table)}
          >
            <Download />
            PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
