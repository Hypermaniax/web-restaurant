import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DisplayQueueItem } from '../api/display-api'
import { getNewReadyNumbers } from '../lib/queue'

const MUTE_STORAGE_KEY = 'rembuk.display.muted'
const HIGHLIGHT_MS = 12_000

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function writeMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, String(muted))
  } catch {
    return
  }
}

function scheduleChime(context: AudioContext) {
  const start = context.currentTime
  const notes = [880, 1174.66]

  notes.forEach((frequency, index) => {
    const noteStart = start + index * 0.16
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.2, noteStart + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.5)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 0.55)
  })
}

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
