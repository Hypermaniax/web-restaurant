import { describe, expect, it } from 'vitest'
import { browserReachableUrl } from './env'

describe('browserReachableUrl', () => {
  it('replaces a loopback host with the page hostname', () => {
    expect(browserReachableUrl('http://localhost:3000', '192.168.100.39')).toBe(
      'http://192.168.100.39:3000',
    )
  })

  it('keeps an explicit non-loopback host', () => {
    expect(
      browserReachableUrl('https://api.example.com', '192.168.100.39'),
    ).toBe('https://api.example.com')
  })

  it('keeps loopback when the page is also loopback', () => {
    expect(browserReachableUrl('http://localhost:3000', 'localhost')).toBe(
      'http://localhost:3000',
    )
  })
})
