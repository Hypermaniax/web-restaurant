import type { Settings, TaxRule } from '../api/types'
import {
  defaultSettingsValues,
  toSettingsFormValues,
  toSettingsUpdateInput,
  toTaxRuleInput,
} from './settings-form'

const settings: Settings = {
  outletId: 'outlet-1',
  taxInclusive: true,
  taxBaseIncludesService: true,
  serviceRateBp: 1000,
  requirePaymentBeforeKitchen: true,
  orderExpiryMinutes: 15,
  cashExpiryMinutes: 30,
  receiptFooter: 'Terima kasih',
  updatedAt: '2026-11-22T00:00:00.000Z',
  qrBaseUrl: 'https://resto.example.com',
}

const taxRules: TaxRule[] = [
  {
    id: 'rule-1',
    outletId: 'outlet-1',
    orderType: 'DINE_IN',
    isEnabled: true,
    rateBp: 1100,
    updatedAt: '2026-11-22T00:00:00.000Z',
  },
  {
    id: 'rule-2',
    outletId: 'outlet-1',
    orderType: 'TAKEAWAY',
    isEnabled: false,
    rateBp: 0,
    updatedAt: '2026-11-22T00:00:00.000Z',
  },
]

describe('settings form mapping', () => {
  it('maps settings and tax rules into form values', () => {
    const values = toSettingsFormValues(settings, taxRules)

    expect(values).toMatchObject({
      taxInclusive: true,
      taxBaseIncludesService: true,
      serviceRate: 10,
      requirePaymentBeforeKitchen: true,
      receiptFooter: 'Terima kasih',
      dineInTaxEnabled: true,
      dineInTaxRate: 11,
      takeawayTaxEnabled: false,
      takeawayTaxRate: 0,
    })
  })

  it('falls back to empty tax rules and footer', () => {
    const values = toSettingsFormValues(
      { ...settings, receiptFooter: null },
      undefined,
    )

    expect(values.receiptFooter).toBe('')
    expect(values.dineInTaxEnabled).toBe(false)
    expect(values.takeawayTaxEnabled).toBe(false)
  })

  it('maps form values back to settings and tax rule payloads', () => {
    const values = {
      ...defaultSettingsValues,
      serviceRate: 10.5,
      receiptFooter: '  Terima kasih  ',
      dineInTaxEnabled: true,
      dineInTaxRate: 11,
      takeawayTaxEnabled: true,
      takeawayTaxRate: 2.5,
    }

    expect(toSettingsUpdateInput(values)).toMatchObject({
      serviceRateBp: 1050,
      receiptFooter: 'Terima kasih',
    })
    expect(toTaxRuleInput(values, 'DINE_IN')).toEqual({
      isEnabled: true,
      rateBp: 1100,
    })
    expect(toTaxRuleInput(values, 'TAKEAWAY')).toEqual({
      isEnabled: true,
      rateBp: 250,
    })
  })

  it('sends null for an empty receipt footer', () => {
    const values = { ...defaultSettingsValues, receiptFooter: '   ' }

    expect(toSettingsUpdateInput(values).receiptFooter).toBeNull()
  })
})
