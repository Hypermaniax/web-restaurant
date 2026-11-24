import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from './page-header'

interface OrdersHeaderProps {
  connected: boolean
  isFetching: boolean
  onRefresh: () => void
}

export function OrdersHeader({
  connected,
  isFetching,
  onRefresh,
}: OrdersHeaderProps) {
  return (
    <PageHeader
      eyebrow="Operasional"
      title="Order monitor"
      description="Pantau order, pembayaran, dan antrian. Hanya order yang belum dibayar yang bisa dibatalkan."
      actions={
        <>
          <Badge
            variant="outline"
            className={
              connected
                ? 'border-pine/15 bg-mint text-pine h-9 gap-2 px-3'
                : 'border-pine/15 bg-card text-muted-foreground h-9 gap-2 px-3'
            }
          >
            {connected ? <Wifi /> : <WifiOff />}
            {connected ? 'Live' : 'Polling 15 detik'}
          </Badge>
          <Button variant="outline" disabled={isFetching} onClick={onRefresh}>
            <RefreshCw className={isFetching ? 'animate-spin' : ''} />
            Muat ulang
          </Button>
        </>
      }
    />
  )
}
