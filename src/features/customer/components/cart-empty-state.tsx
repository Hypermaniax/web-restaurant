import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface CartEmptyStateProps {
  onClose: () => void
}

export function CartEmptyState({ onClose }: CartEmptyStateProps) {
  return (
    <div className="p-5">
      <Empty className="border-pine/10 bg-rice/60 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingBag />
          </EmptyMedia>
          <EmptyTitle>Belum ada pesanan</EmptyTitle>
          <EmptyDescription>
            Pilih menu yang kamu mau, lalu kembali ke sini untuk memeriksa
            pesanan.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" variant="outline" onClick={onClose}>
            Lihat menu
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
