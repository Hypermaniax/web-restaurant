import { Info } from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SettingsQrWarning({ qrBaseUrl }: { qrBaseUrl: string }) {
  if (!qrBaseUrl.includes('localhost')) {
    return null
  }

  return (
    <div className="border-marigold/40 bg-marigold/10 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm">
      <Info className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-semibold">QR_BASE_URL masih localhost</p>
        <p className="text-pine/70 mt-1">
          QR meja tidak akan bisa dibuka dari HP customer. Ganti `QR_BASE_URL`
          ke alamat LAN atau domain publik, lalu restart backend.
        </p>
      </div>
    </div>
  )
}

export function SettingsQrBaseCard({ qrBaseUrl }: { qrBaseUrl: string }) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardDescription>QR_BASE_URL aktif</CardDescription>
        <CardTitle className="font-mono text-sm break-all">
          {qrBaseUrl}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
