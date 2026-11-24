import { Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react'
import { BrandLockup } from '@/components/brand-lockup'
import { ConnectionBadge } from './connection-badge'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
})
const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const controlClass =
  'border-rice/20 text-rice/75 hover:border-rice/40 hover:bg-rice/10 hover:text-rice focus-visible:ring-marigold/60 inline-flex size-10 items-center justify-center rounded-full border transition focus-visible:ring-[3px] focus-visible:outline-none xl:size-11'

interface DisplayHeaderProps {
  connected: boolean
  hasData: boolean
  isError: boolean
  lastUpdatedLabel: string | null
  now: Date
  muted: boolean
  onToggleMuted: () => void
  fullscreen: {
    isFullscreen: boolean
    supported: boolean
    toggle: () => Promise<void>
  }
}

export function DisplayHeader({
  connected,
  hasData,
  isError,
  lastUpdatedLabel,
  now,
  muted,
  onToggleMuted,
  fullscreen,
}: DisplayHeaderProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex min-w-0 items-center gap-4">
        <BrandLockup variant="dark" className="h-8 xl:h-10" />
        <span className="bg-rice/20 hidden h-7 w-px sm:block" />
        <p className="font-display text-rice/70 hidden text-sm font-semibold tracking-tight sm:block xl:text-base">
          Papan antrian
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ConnectionBadge
          connected={connected}
          hasData={hasData}
          isError={isError}
          lastUpdatedLabel={lastUpdatedLabel}
        />

        <time
          dateTime={now.toISOString()}
          className="hidden text-right md:block"
        >
          <span className="text-rice/60 block text-[0.65rem] font-semibold tracking-[0.16em] uppercase">
            {dateFormatter.format(now)}
          </span>
          <span className="font-display block text-2xl leading-none font-bold tabular-nums xl:text-3xl">
            {timeFormatter.format(now)}
          </span>
        </time>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={
              muted ? 'Aktifkan suara antrian' : 'Bisukan suara antrian'
            }
            aria-pressed={muted}
            title={muted ? 'Aktifkan suara' : 'Bisukan suara'}
            onClick={onToggleMuted}
            className={controlClass}
          >
            {muted ? (
              <VolumeX aria-hidden="true" className="size-5" />
            ) : (
              <Volume2 aria-hidden="true" className="size-5" />
            )}
          </button>

          {fullscreen.supported ? (
            <button
              type="button"
              aria-label={
                fullscreen.isFullscreen
                  ? 'Keluar layar penuh'
                  : 'Masuk layar penuh'
              }
              aria-pressed={fullscreen.isFullscreen}
              title={
                fullscreen.isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'
              }
              onClick={() => void fullscreen.toggle()}
              className={controlClass}
            >
              {fullscreen.isFullscreen ? (
                <Minimize2 aria-hidden="true" className="size-5" />
              ) : (
                <Maximize2 aria-hidden="true" className="size-5" />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
