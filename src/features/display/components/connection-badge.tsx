import { cn } from '@/lib/utils'

interface ConnectionBadgeProps {
  connected: boolean
  hasData: boolean
  isError: boolean
  lastUpdatedLabel: string | null
}

export function ConnectionBadge({
  connected,
  hasData,
  isError,
  lastUpdatedLabel,
}: ConnectionBadgeProps) {
  const state = getState(connected, hasData, isError)

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide sm:gap-3 sm:px-4 sm:text-sm',
        state.className,
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            'size-2 rounded-full',
            state.dotClassName,
            connected && 'motion-safe:animate-pulse',
          )}
        />
        {state.label}
      </span>
      {!connected && lastUpdatedLabel ? (
        <span className="text-rice/60 hidden border-l border-current/20 pl-3 sm:inline">
          Data {lastUpdatedLabel}
        </span>
      ) : null}
    </div>
  )
}

function getState(connected: boolean, hasData: boolean, isError: boolean) {
  if (connected && hasData) {
    return {
      label: 'Live',
      className: 'border-mint/30 bg-mint/10 text-mint',
      dotClassName: 'bg-mint',
    }
  }

  if (hasData) {
    return {
      label: 'Polling',
      className: 'border-marigold/35 bg-marigold/10 text-marigold',
      dotClassName: 'bg-marigold',
    }
  }

  if (isError) {
    return {
      label: 'Terputus',
      className: 'border-chili/40 bg-chili/15 text-[#ffb7a6]',
      dotClassName: 'bg-chili',
    }
  }

  return {
    label: 'Menghubungkan',
    className: 'border-rice/20 bg-rice/5 text-rice/75',
    dotClassName: 'bg-rice/60',
  }
}
