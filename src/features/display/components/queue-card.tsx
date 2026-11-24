import { cn } from '@/lib/utils'
import type { DisplayQueueItem } from '../api/display-api'
import {
  formatQueueNumber,
  getOrderMetaLabel,
  getOrderTypeLabel,
} from '../lib/queue'

interface QueueCardProps {
  item: DisplayQueueItem
  fresh: boolean
  tone: 'preparing' | 'ready'
}

export function QueueCard({ item, fresh, tone }: QueueCardProps) {
  const queueLabel = formatQueueNumber(item.queueNumber)
  const orderTypeLabel = getOrderTypeLabel(item.orderType)
  const metaLabel = getOrderMetaLabel(item)
  const isReady = tone === 'ready'

  return (
    <li
      aria-label={`Antrian ${queueLabel}, ${orderTypeLabel}, ${metaLabel}`}
      className={cn(
        'display-queue-in relative flex min-h-0 items-center justify-between gap-4 overflow-hidden rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3',
        isReady
          ? 'bg-marigold text-pine'
          : 'border-rice/12 bg-rice/[0.055] text-rice border',
        fresh && 'display-ready-fresh ring-rice ring-4',
      )}
    >
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <span className="font-display text-[clamp(2.75rem,4.4vw,5.5rem)] leading-[0.82] font-bold tracking-[-0.04em] tabular-nums">
          {queueLabel}
        </span>
        <span
          className={cn(
            'h-12 w-px shrink-0 sm:h-14',
            isReady ? 'bg-pine/20' : 'bg-rice/15',
          )}
        />
        <div className="min-w-0">
          <p className="font-display text-lg leading-tight font-bold tracking-tight sm:text-xl xl:text-2xl">
            {orderTypeLabel}
          </p>
          <p
            className={cn(
              'mt-1 truncate text-sm font-medium sm:text-base',
              isReady ? 'text-pine/70' : 'text-rice/65',
            )}
          >
            {metaLabel}
          </p>
        </div>
      </div>

      {fresh ? (
        <span className="bg-rice text-pine shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.16em] uppercase">
          Baru
        </span>
      ) : null}
    </li>
  )
}
