export type SelectionType = 'SINGLE' | 'MULTIPLE'
export type PaymentMethod = 'QRIS' | 'CASH'

export interface PublicModifierOption {
  id: string
  name: string
  priceDelta: number
  isDefault: boolean
  sortOrder: number
}

export interface PublicModifierGroup {
  id: string
  name: string
  selectionType: SelectionType
  minSelect: number
  maxSelect: number | null
  isRequired: boolean
  sortOrder: number
  options: PublicModifierOption[]
}

export interface PublicMenuItem {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  isAvailable: boolean
  sortOrder: number
  modifierGroups: PublicModifierGroup[]
}

export interface PublicCategory {
  id: string
  name: string
  sortOrder: number
  items: PublicMenuItem[]
}

export interface PublicMenu {
  table: {
    id: string
    code: string
    name: string
    zone: string | null
  }
  outlet: {
    id: string
    name: string
    slug: string
  }
  session: {
    id: string
    status: string
    guestCount: number | null
    openedAt: string
  } | null
  categories: PublicCategory[]
}

export interface QuoteInputItem {
  menuItemId: string
  qty: number
  modifierOptionIds?: string[]
  notes?: string | null
}

export interface QuoteTotals {
  subtotal: number
  discountAmount: number
  serviceAmount: number
  taxAmount: number
  total: number
  taxInclusive: boolean
  taxBaseIncludesService: boolean
  taxRateBp: number
  serviceRateBp: number
}

export interface CreatedOrder extends QuoteTotals {
  id: string
  orderNumber: string
  orderType: 'DINE_IN'
  status: string
  paymentStatus: string
  table: {
    id: string
    code: string
    name: string
  } | null
  queueNumber: number | null
  queueDisplay: string | null
  customerName: string | null
  notes: string | null
  expiresAt: string
  createdAt: string
  message?: string
}

export interface QrisPayment {
  paymentId: string
  referenceId: string
  status: string
  amount: number
  qrString: string
  expiresAt: string
  message?: string
}

export interface PublicPaymentStatus {
  status: string
  queueNumber: number | null
  queueDisplay: string | null
}

export interface PaymentSimulation {
  status: string
  message?: string
}
