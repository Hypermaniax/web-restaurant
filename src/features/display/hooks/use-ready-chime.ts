import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DisplayQueueItem } from '../api/display-api'
import { scheduleChime } from '../lib/chime'
import { readMuted, writeMuted } from '../lib/muted-preference'
import { getNewReadyNumbers } from '../lib/queue'

const HIGHLIGHT_MS = 12_000

export function useReadyChime(ready: DisplayQueueItem[]) {
  const [muted, setMuted] = useState(readMuted)
  const [freshReady, setFreshReady] = useState<Set<number>>(new Set())
  const mutedRef = useRef(muted)
  const audioRef = useRef<AudioContext | null>(null)
  const previousReadyRef = useRef<Set<number> | null>(null)
  const freshTimerRef = useRef<number | null>(null)

  const readyNumbers = useMemo(
    () => ready.map((item) => item.queueNumber).sort((a, b) => a - b),
    [ready],
  )

  const ensureAudioContext = useCallback(() => {
    if (typeof window === 'undefined' || !window.AudioContext) {
      return null
    }
    audioRef.current ??= new window.AudioContext()
    return audioRef.current
  }, [])

  const playChime = useCallback(() => {
    if (mutedRef.current || document.visibilityState === 'hidden') {
      return
    }

    const context = ensureAudioContext()
    if (!context) {
      return
    }

    if (context.state === 'suspended') {
      void context
        .resume()
        .then(() => scheduleChime(context))
        .catch(() => undefined)
      return
    }

    scheduleChime(context)
  }, [ensureAudioContext])

  useEffect(() => {
    const previous = previousReadyRef.current
    previousReadyRef.current = new Set(readyNumbers)

    if (!previous) {
      return
    }

    const arrived = getNewReadyNumbers(previous, readyNumbers)
    if (arrived.length === 0) {
      return
    }

    setFreshReady((current) => new Set([...current, ...arrived]))
    if (freshTimerRef.current !== null) {
      window.clearTimeout(freshTimerRef.current)
    }
    freshTimerRef.current = window.setTimeout(() => {
      setFreshReady(new Set())
    }, HIGHLIGHT_MS)
    playChime()
  }, [playChime, readyNumbers])

  useEffect(() => {
    const unlock = () => {
      const context = audioRef.current
      if (context?.state === 'suspended') {
        void context.resume().catch(() => undefined)
      }
    }

    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('keydown', unlock)

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      if (freshTimerRef.current !== null) {
        window.clearTimeout(freshTimerRef.current)
      }
      void audioRef.current?.close().catch(() => undefined)
      audioRef.current = null
    }
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current
      mutedRef.current = next
      writeMuted(next)

      if (!next) {
        const context = ensureAudioContext()
        if (context?.state === 'suspended') {
          void context.resume().catch(() => undefined)
        }
      }

      return next
    })
  }, [ensureAudioContext])

  return { muted, toggleMuted, freshReady }
}
