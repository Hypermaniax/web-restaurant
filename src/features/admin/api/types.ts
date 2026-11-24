import type { UserRole } from '@/lib/auth/types'

export interface PageMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PageResult<T> {
  items: T[]
  meta: PageMeta
}

export type SelectionType = 'SINGLE' | 'MULTIPLE'
export type TableStatus = 'AVAILABLE' | 'OCCUPIED'
export type TableSessionStatus = 'OPEN' | 'CLOSED'

export interface Category {
  id: string
  outletId: string
  name: string
  sortOrder: number
  isActive: boolean
}

export interface ModifierOption {
  id: string
  groupId: string
  name: string
  priceDelta: number
  isDefault: boolean
  isActive: boolean
  sortOrder: number
}

export interface ModifierGroup {
  id: string
  outletId: string
  name: string
  selectionType: SelectionType
  minSelect: number
  maxSelect: number | null
  isRequired: boolean
  isActive: boolean
  sortOrder: number
  options: ModifierOption[]
}

export interface MenuItem {
  id: string
  outletId: string
  categoryId: string
  categoryName: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  isAvailable: boolean
  isActive: boolean
  sortOrder: number
  modifierGroups: ModifierGroup[]
  createdAt: string
  updatedAt: string
}

export interface TableSession {
  id: string
  tableId: string
  status: TableSessionStatus
  guestCount: number | null
  openedAt: string
  closedAt: string | null
  closedByUserId: string | null
}

export interface Table {
  id: string
  outletId: string
  code: string
  name: string
  zone: string | null
  status: TableStatus
  isActive: boolean
  openSession: TableSession | null
  createdAt: string
  updatedAt: string
}

export interface Staff {
  id: string
  outletId: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

export interface Settings {
  outletId: string
  taxInclusive: boolean
  taxBaseIncludesService: boolean
  serviceRateBp: number
  requirePaymentBeforeKitchen: boolean
  orderExpiryMinutes: number
  cashExpiryMinutes: number
  receiptFooter: string | null
  updatedAt: string
  qrBaseUrl: string
}

export interface TaxRule {
  id: string
  outletId: string
  orderType: 'DINE_IN' | 'TAKEAWAY'
  isEnabled: boolean
  rateBp: number
  updatedAt: string
}

export interface DashboardSummary {
  businessDate: string
  revenueToday: number
  openTables: number
  pendingPayments: number
  kdsQueue: number
}

export interface MessageResponse {
  message?: string
}

export type WithMessage<T> = T & MessageResponse
