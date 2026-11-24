import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { QuoteTotals } from '../api/types'
import { PriceBreakdown } from './price-breakdown'

const quote: QuoteTotals = {
  subtotal: 28000,
  discountAmount: 0,
  serviceAmount: 1400,
  taxAmount: 2940,
  total: 32340,
  taxInclusive: false,
  taxBaseIncludesService: true,
  taxRateBp: 1000,
  serviceRateBp: 500,
}

describe('PriceBreakdown', () => {
  it('shows server totals and exclusive tax note', () => {
    render(<PriceBreakdown quote={quote} />)

    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getByText('Service 5%')).toBeInTheDocument()
    expect(screen.getByText('Pajak 10%')).toBeInTheDocument()
    expect(screen.getByText('Rp 32.340')).toBeInTheDocument()
    expect(screen.getByText('Pajak ditambahkan ke total.')).toBeInTheDocument()
  })

  it('marks inclusive tax clearly', () => {
    render(<PriceBreakdown quote={{ ...quote, taxInclusive: true }} />)

    expect(screen.getByText('Pajak 10% (termasuk)')).toBeInTheDocument()
    expect(
      screen.getByText('Harga menu sudah termasuk pajak.'),
    ).toBeInTheDocument()
  })
})
