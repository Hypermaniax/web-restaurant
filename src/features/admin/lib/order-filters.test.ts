import { setOrderFilter } from './order-filters'

describe('setOrderFilter', () => {
  it('sets and clears a filter without touching the others', () => {
    const filters = { date: '2026-11-22', status: 'PAID' as const }

    expect(setOrderFilter(filters, 'orderType', 'DINE_IN')).toEqual({
      date: '2026-11-22',
      status: 'PAID',
      orderType: 'DINE_IN',
    })
    expect(setOrderFilter(filters, 'status', 'all')).toEqual({
      date: '2026-11-22',
    })
    expect(setOrderFilter(filters, 'date', '')).toEqual({ status: 'PAID' })
  })
})
