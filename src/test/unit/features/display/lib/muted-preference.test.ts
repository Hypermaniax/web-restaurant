import { afterEach, describe, expect, it } from 'vitest'
import { readMuted, writeMuted } from '@/features/display/lib/muted-preference'

describe('muted preference', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('defaults to unmuted', () => {
    expect(readMuted()).toBe(false)
  })

  it('persists the muted state', () => {
    writeMuted(true)
    expect(readMuted()).toBe(true)

    writeMuted(false)
    expect(readMuted()).toBe(false)
  })
})
