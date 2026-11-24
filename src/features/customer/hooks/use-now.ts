import { useEffect, useState } from 'react'

export function useNow(enabled: boolean, intervalMs = 1_000): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) {
      return
    }

    const interval = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(interval)
  }, [enabled, intervalMs])

  return now
}
