import { Timer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PaymentMethodHeaderProps {
  isQris: boolean
}

export function PaymentMethodHeader({ isQris }: PaymentMethodHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-display text-pine text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          {isQris ? 'Bayar dengan QRIS' : 'Bayar di kasir'}
        </h1>
        <p className="text-pine/55 mt-2 text-sm leading-6">
          {isQris
            ? 'Scan QR di bawah dengan aplikasi pembayaran.'
            : 'Tunjukkan nomor order ke kasir untuk menyelesaikan pembayaran.'}
        </p>
      </div>
      <Badge variant="secondary" className="gap-1.5">
        <Timer className="size-3.5" />
        {isQris ? 'Menunggu pembayaran' : 'Menunggu kasir'}
      </Badge>
    </div>
  )
}
