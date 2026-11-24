import { cn } from '@/lib/utils'
import type { DisplayQueueItem } from '../api/display-api'
import { getVisibleQueue } from '../lib/queue'
import { QueueCard } from './queue-card'

interface QueueColumnProps {
  tone: 'preparing' | 'ready'
  title: string
  subtitle: string
  emptyTitle: string
  emptyBody: string
  items: DisplayQueueItem[]
  freshReady: Set<number>
}

export function QueueColumn({
  tone,
  title,
  subtitle,
  emptyTitle,
  emptyBody,
  items,
  freshReady,
}: QueueColumnProps) {
  const { visible, hiddenCount } = getVisibleQueue(items)
  const isReady = tone === 'ready'
  const headingId = `queue-${tone}`

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'flex min-h-0 flex-col rounded-[1.75rem] border p-4 sm:p-5 xl:p-6',
        isReady
          ? 'border-marigold/35 bg-marigold/[0.08]'
          : 'border-rice/12 bg-rice/[0.035]',
      )}
    >
      <header className="flex shrink-0 items-end justify-between gap-4">
        <div>
          <h2
            id={headingId}
            className={cn(
              'font-display text-2xl leading-none font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl',
              isReady ? 'text-marigold' : 'text-rice',
            )}
          >
            {title}
          </h2>
          <p className="text-rice/65 mt-2 text-sm font-medium sm:text-base">
            {subtitle}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold tabular-nums sm:text-sm',
            isReady
              ? 'bg-marigold text-pine'
              : 'border-rice/20 text-rice/75 border',
          )}
        >
          {items.length} antrian
        </span>
      </header>

      {visible.length === 0 ? (
        <div className="border-rice/12 bg-pine/25 mt-4 flex min-h-28 flex-1 flex-col justify-center rounded-2xl border px-5 py-6">
          <p className="font-display text-rice text-xl font-bold sm:text-2xl">
            {emptyTitle}
          </p>
          <p className="text-rice/60 mt-1 max-w-md text-sm sm:text-base">
            {emptyBody}
          </p>
        </div>
      ) : (
        <ol className="mt-4 flex flex-col gap-2.5">
          {visible.map((item) => (
            <QueueCard
              key={item.queueNumber}
              item={item}
              tone={tone}
              fresh={isReady && freshReady.has(item.queueNumber)}
            />
          ))}
        </ol>
      )}

      {hiddenCount > 0 ? (
        <p
          className={cn(
            'mt-auto pt-3 text-sm font-semibold',
            isReady ? 'text-marigold' : 'text-rice/65',
          )}
        >
          +{hiddenCount} antrian lain
        </p>
      ) : null}
    </section>
  )
}
