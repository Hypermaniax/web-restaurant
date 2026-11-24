import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from './page-header'

interface TablesHeaderProps {
  isDownloadingPdf: boolean
  onCreate: () => void
  onDownloadPdf: () => void
}

export function TablesHeader({
  isDownloadingPdf,
  onCreate,
  onDownloadPdf,
}: TablesHeaderProps) {
  return (
    <PageHeader
      eyebrow="Restoran"
      title="Meja & QR"
      description="Cetak QR meja dari server agar ukuran dan quiet zone konsisten."
      actions={
        <>
          <Button
            variant="outline"
            disabled={isDownloadingPdf}
            onClick={onDownloadPdf}
          >
            <Download />
            Unduh semua PDF
          </Button>
          <Button variant="accent" onClick={onCreate}>
            <Plus />
            Tambah meja
          </Button>
        </>
      }
    />
  )
}
