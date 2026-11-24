import type { Table } from '../api/types'
import { isLocalQrUrl, toTableInput, toTableValues } from './table-form'

const table: Table = {
  id: 'table-1',
  outletId: 'outlet-1',
  code: 'T01',
  name: 'Meja 01',
  zone: 'Indoor',
  status: 'AVAILABLE',
  isActive: true,
  openSession: null,
  createdAt: '2026-11-22T00:00:00.000Z',
  updatedAt: '2026-11-22T00:00:00.000Z',
}

describe('table form mapping', () => {
  it('maps a table and normalizes the API payload', () => {
    expect(toTableValues(table)).toEqual({
      code: 'T01',
      name: 'Meja 01',
      zone: 'Indoor',
      isActive: true,
    })
    expect(
      toTableInput({
        code: ' t02 ',
        name: 'Meja 02',
        zone: '  ',
        isActive: false,
      }),
    ).toEqual({
      code: 'T02',
      name: 'Meja 02',
      zone: null,
      isActive: false,
    })
  })

  it('detects local QR base URLs', () => {
    expect(isLocalQrUrl('http://localhost:5173')).toBe(true)
    expect(isLocalQrUrl('https://resto.example.com')).toBe(false)
    expect(isLocalQrUrl(undefined)).toBe(false)
  })
})
