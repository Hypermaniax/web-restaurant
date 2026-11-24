import { calculatePreview } from '@/features/admin/lib/settings-preview'

describe('calculatePreview', () => {
  it('adds exclusive tax on top of subtotal and service', () => {
    const preview = calculatePreview({
      subtotal: 100_000,
      orderType: 'DINE_IN',
      serviceRate: 10,
      taxRate: 11,
      taxInclusive: false,
      taxBaseIncludesService: true,
    })

    expect(preview).toEqual({
      subtotal: 100_000,
      service: 10_000,
      tax: 12_100,
      total: 122_100,
    })
  })

  it('extracts inclusive tax from the configured base', () => {
    const preview = calculatePreview({
      subtotal: 100_000,
      orderType: 'TAKEAWAY',
      serviceRate: 10,
      taxRate: 11,
      taxInclusive: true,
      taxBaseIncludesService: false,
    })

    expect(preview.service).toBe(0)
    expect(preview.tax).toBe(9_910)
    expect(preview.total).toBe(100_000)
  })

  it('does not add service charge for takeaway', () => {
    const preview = calculatePreview({
      subtotal: 50_000,
      orderType: 'TAKEAWAY',
      serviceRate: 10,
      taxRate: 0,
      taxInclusive: false,
      taxBaseIncludesService: false,
    })

    expect(preview.service).toBe(0)
    expect(preview.total).toBe(50_000)
  })
})
