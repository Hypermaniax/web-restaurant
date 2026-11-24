import { useEffect } from 'react'
import type { DisplayQueueItem } from '../api/display-api'
import { useDisplayQueue } from '../api/display-api'
import {
  DisplayError,
  DisplayLoading,
  DisplayStaleWarning,
} from '../components/display-feedback'
import { DisplayHeader } from '../components/display-header'
import { QueueColumn } from '../components/queue-column'
import { useDisplayClock } from '../hooks/use-display-clock'
import { useDisplayRealtime } from '../hooks/use-display-realtime'
import { useFullscreen } from '../hooks/use-fullscreen'
import { useReadyChime } from '../hooks/use-ready-chime'
import { useWakeLock } from '../hooks/use-wake-lock'
import { formatQueueNumber } from '../lib/queue'

const emptyQueue: DisplayQueueItem[] = []
const updatedFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export function DisplayPage() {
  const { connected, lastEventAt } = useDisplayRealtime()
  const queue = useDisplayQueue(connected)
  useWakeLock()
  const fullscreen = useFullscreen()
  const now = useDisplayClock()
  const preparing = queue.data?.preparing ?? emptyQueue
  const ready = queue.data?.ready ?? emptyQueue
  const { muted, toggleMuted, freshReady } = useReadyChime(ready)
  const hasData = Boolean(queue.data)
  const lastUpdatedAt = Math.max(queue.dataUpdatedAt, lastEventAt ?? 0) || null
  const lastUpdatedLabel = lastUpdatedAt
    ? updatedFormatter.format(new Date(lastUpdatedAt))
    : null
  const freshLabels = [...freshReady]
    .sort((a, b) => a - b)
    .map(formatQueueNumber)
    .join(', ')

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Papan antrian · Rembuk'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="bg-pine text-rice min-h-svh lg:h-svh lg:overflow-hidden">
      <h1 className="sr-only">Papan antrian publik Rembuk</h1>
      <div className="mx-auto flex min-h-svh w-full max-w-[1920px] flex-col px-4 py-4 sm:px-6 lg:h-svh lg:min-h-0 lg:px-8 xl:px-10 xl:py-6">
        <DisplayHeader
          connected={connected}
          hasData={hasData}
          isError={queue.isError}
          lastUpdatedLabel={lastUpdatedLabel}
          now={now}
          muted={muted}
          onToggleMuted={toggleMuted}
          fullscreen={fullscreen}
        />

        <div className="sr-only" aria-live="polite">
          {freshReady.size > 0 ? `Pesanan siap diambil: ${freshLabels}` : ''}
        </div>

        {queue.isError && hasData ? <DisplayStaleWarning /> : null}

        {queue.isLoading && !hasData ? (
          <DisplayLoading />
        ) : queue.isError && !hasData ? (
          <DisplayError onRetry={() => void queue.refetch()} />
        ) : (
          <div className="mt-4 grid flex-1 gap-3 sm:gap-4 lg:min-h-0 lg:grid-cols-2">
            <QueueColumn
              tone="preparing"
              title="Sedang disiapkan"
              subtitle="Pesanan yang sudah dibayar sedang dikerjakan."
              emptyTitle="Belum ada antrian"
              emptyBody="Nomor antrian baru akan muncul di sini setelah pembayaran diterima."
              items={preparing}
              freshReady={freshReady}
            />
            <QueueColumn
              tone="ready"
              title="Siap diambil"
              subtitle="Silakan ambil pesanan saat nomormu tampil."
              emptyTitle="Belum ada pesanan siap"
              emptyBody="Pesanan yang selesai akan tampil di sini."
              items={ready}
              freshReady={freshReady}
            />
          </div>
        )}

        <footer className="text-rice/65 mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <span>
            Pembaruan otomatis
            {lastUpdatedLabel ? ` · terakhir ${lastUpdatedLabel}` : ''}
          </span>
          <span>Tanpa data pribadi</span>
        </footer>
      </div>
    </main>
  )
}
