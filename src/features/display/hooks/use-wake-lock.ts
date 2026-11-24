import { useEffect } from 'react'

interface WakeLockSentinelLike {
  released: boolean
  release: () => Promise<void>
  addEventListener: (type: 'release', listener: () => void) => void
}

interface WakeLockLike {
  request: (type: 'screen') => Promise<WakeLockSentinelLike>
}

function getWakeLock(): WakeLockLike | null {
  const navigatorWithWakeLock = navigator as Navigator & {
    wakeLock?: WakeLockLike
  }
  return navigatorWithWakeLock.wakeLock ?? null
}

export function useWakeLock() {
  useEffect(() => {
    let sentinel: WakeLockSentinelLike | null = null
    let disposed = false

    const request = async () => {
      if (
        disposed ||
        document.visibilityState !== 'visible' ||
        sentinel !== null
      ) {
        return
      }

      const wakeLock = getWakeLock()
      if (!wakeLock) {
        return
      }

      try {
        const next = await wakeLock.request('screen')
        if (disposed) {
          await next.release().catch(() => undefined)
          return
        }
        sentinel = next
        next.addEventListener('release', () => {
          sentinel = null
        })
      } catch {
        return
      }
    }

    void request()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void request()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      disposed = true
      document.removeEventListener('visibilitychange', handleVisibility)
      if (sentinel) {
        const current = sentinel
        sentinel = null
        void current.release().catch(() => undefined)
      }
    }
  }, [])
}
