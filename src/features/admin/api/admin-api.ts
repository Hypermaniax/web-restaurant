import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type { UserRole } from '@/lib/auth/types'
import type {
  Category,
  DashboardSummary,
  MenuItem,
  MessageResponse,
  ModifierGroup,
  PageResult,
  SelectionType,
  Settings,
  Staff,
  Table,
  TaxRule,
  WithMessage,
} from './types'

export const adminKeys = {
  dashboard: ['admin', 'dashboard'] as const,
  categories: ['admin', 'categories'] as const,
  menu: ['admin', 'menu'] as const,
  modifiers: ['admin', 'modifiers'] as const,
  tables: ['admin', 'tables'] as const,
  staff: ['admin', 'staff'] as const,
  settings: ['admin', 'settings'] as const,
  taxRules: ['admin', 'tax-rules'] as const,
  orders: ['admin', 'orders'] as const,
  reports: ['admin', 'reports'] as const,
}

function withQuery(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export interface PageParams {
  page?: number
  pageSize?: number
  all?: boolean
}

function pageParams(params: PageParams) {
  return {
    page: params.all ? undefined : (params.page ?? 1),
    pageSize: params.all ? undefined : params.pageSize,
    all: params.all,
  }
}

export interface CategoryInput {
  name: string
  sortOrder: number
  isActive?: boolean
}

export interface MenuItemInput {
  categoryId: string
  name: string
  description?: string | null
  price: number
  imageUrl?: string | null
  isAvailable?: boolean
  isActive?: boolean
  sortOrder?: number
  modifierGroupIds?: string[]
}

export interface ModifierGroupInput {
  name: string
  selectionType: SelectionType
  minSelect: number
  maxSelect?: number | null
  isRequired: boolean
  isActive?: boolean
  sortOrder?: number
}

export interface ModifierOptionInput {
  name: string
  priceDelta: number
  isDefault?: boolean
  isActive?: boolean
  sortOrder?: number
}

export interface TableInput {
  code: string
  name: string
  zone?: string | null
  isActive?: boolean
}

export interface StaffInput {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateSettingsInput {
  taxInclusive?: boolean
  taxBaseIncludesService?: boolean
  serviceRateBp?: number
  requirePaymentBeforeKitchen?: boolean
  orderExpiryMinutes?: number
  cashExpiryMinutes?: number
  receiptFooter?: string | null
}

export interface UpdateTaxRuleInput {
  isEnabled: boolean
  rateBp: number
}

export const adminApi = {
  dashboard: () => apiRequest<DashboardSummary>('/cashier/dashboard'),
  categories: {
    list: (includeInactive = false, page: PageParams = {}) =>
      apiRequest<PageResult<Category>>(
        withQuery('/admin/categories', {
          includeInactive,
          ...pageParams(page),
        }),
      ),
    create: (input: CategoryInput) =>
      apiRequest<WithMessage<Category>>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: string, input: Partial<CategoryInput>) =>
      apiRequest<WithMessage<Category>>(`/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    remove: (id: string) =>
      apiRequest<WithMessage<Category>>(`/admin/categories/${id}`, {
        method: 'DELETE',
      }),
  },
  menu: {
    list: (includeInactive = false, page: PageParams = {}) =>
      apiRequest<PageResult<MenuItem>>(
        withQuery('/admin/menu-items', {
          includeInactive,
          ...pageParams(page),
        }),
      ),
    create: (input: MenuItemInput) =>
      apiRequest<WithMessage<MenuItem>>('/admin/menu-items', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: string, input: Partial<MenuItemInput>) =>
      apiRequest<WithMessage<MenuItem>>(`/admin/menu-items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    uploadImage: (id: string, file: File) => {
      const form = new FormData()
      form.append('file', file)
      return apiRequest<WithMessage<MenuItem>>(
        `/admin/menu-items/${id}/image`,
        {
          method: 'POST',
          body: form,
        },
      )
    },
    remove: (id: string) =>
      apiRequest<WithMessage<MenuItem>>(`/admin/menu-items/${id}`, {
        method: 'DELETE',
      }),
  },
  modifiers: {
    list: (includeInactive = false, page: PageParams = {}) =>
      apiRequest<PageResult<ModifierGroup>>(
        withQuery('/admin/modifier-groups', {
          includeInactive,
          ...pageParams(page),
        }),
      ),
    createGroup: (input: ModifierGroupInput) =>
      apiRequest<WithMessage<ModifierGroup>>('/admin/modifier-groups', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    updateGroup: (id: string, input: Partial<ModifierGroupInput>) =>
      apiRequest<WithMessage<ModifierGroup>>(`/admin/modifier-groups/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    removeGroup: (id: string) =>
      apiRequest<WithMessage<ModifierGroup>>(`/admin/modifier-groups/${id}`, {
        method: 'DELETE',
      }),
    createOption: (groupId: string, input: ModifierOptionInput) =>
      apiRequest<WithMessage<ModifierGroup>>(
        `/admin/modifier-groups/${groupId}/options`,
        { method: 'POST', body: JSON.stringify(input) },
      ),
    updateOption: (id: string, input: Partial<ModifierOptionInput>) =>
      apiRequest<WithMessage<ModifierGroup>>(`/admin/modifier-options/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    removeOption: (id: string) =>
      apiRequest<WithMessage<ModifierGroup>>(`/admin/modifier-options/${id}`, {
        method: 'DELETE',
      }),
  },
  tables: {
    list: (includeInactive = false, page: PageParams = {}) =>
      apiRequest<PageResult<Table>>(
        withQuery('/admin/tables', {
          includeInactive,
          ...pageParams(page),
        }),
      ),
    cashierList: () => apiRequest<Table[]>('/cashier/tables'),
    create: (input: TableInput) =>
      apiRequest<WithMessage<Table>>('/admin/tables', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: string, input: Partial<TableInput>) =>
      apiRequest<WithMessage<Table>>(`/admin/tables/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    remove: (id: string) =>
      apiRequest<WithMessage<Table>>(`/admin/tables/${id}`, {
        method: 'DELETE',
      }),
  },
  staff: {
    list: (page: PageParams = {}) =>
      apiRequest<PageResult<Staff>>(
        withQuery('/admin/staff', pageParams(page)),
      ),
    create: (input: StaffInput) =>
      apiRequest<WithMessage<Staff>>('/admin/staff', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: string, input: { name?: string; role?: UserRole }) =>
      apiRequest<WithMessage<Staff>>(`/admin/staff/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    deactivate: (id: string) =>
      apiRequest<WithMessage<Staff>>(`/admin/staff/${id}/deactivate`, {
        method: 'PATCH',
      }),
    resetPassword: (id: string, password: string) =>
      apiRequest<MessageResponse>(`/admin/staff/${id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ password }),
      }),
  },
  settings: {
    get: () => apiRequest<Settings>('/admin/settings'),
    update: (input: UpdateSettingsInput) =>
      apiRequest<WithMessage<Settings>>('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    taxRules: () => apiRequest<TaxRule[]>('/admin/tax-rules'),
    updateTaxRule: (
      orderType: TaxRule['orderType'],
      input: UpdateTaxRuleInput,
    ) =>
      apiRequest<WithMessage<TaxRule>>(`/admin/tax-rules/${orderType}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
  },
}

export function useDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: adminApi.dashboard,
  })
}

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: [...adminKeys.categories, 'all', includeInactive],
    queryFn: () => adminApi.categories.list(includeInactive, { all: true }),
    select: (page) => page.items,
  })
}

export function useCategoriesPage(
  includeInactive = false,
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: [...adminKeys.categories, includeInactive, page, pageSize],
    queryFn: () =>
      adminApi.categories.list(includeInactive, { page, pageSize }),
  })
}

export function useMenuItems(includeInactive = false, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminKeys.menu, includeInactive, page, pageSize],
    queryFn: () => adminApi.menu.list(includeInactive, { page, pageSize }),
  })
}

export function useModifierGroups(includeInactive = false) {
  return useQuery({
    queryKey: [...adminKeys.modifiers, 'all', includeInactive],
    queryFn: () => adminApi.modifiers.list(includeInactive, { all: true }),
    select: (page) => page.items,
  })
}

export function useModifierGroupsPage(
  includeInactive = false,
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: [...adminKeys.modifiers, includeInactive, page, pageSize],
    queryFn: () => adminApi.modifiers.list(includeInactive, { page, pageSize }),
  })
}

export function useTables(includeInactive = false, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminKeys.tables, includeInactive, page, pageSize],
    queryFn: () => adminApi.tables.list(includeInactive, { page, pageSize }),
  })
}

export function useCashierTables() {
  return useQuery({
    queryKey: [...adminKeys.tables, 'cashier'],
    queryFn: adminApi.tables.cashierList,
  })
}

export function useStaff(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminKeys.staff, page, pageSize],
    queryFn: () => adminApi.staff.list({ page, pageSize }),
  })
}

export function useSettings() {
  return useQuery({
    queryKey: adminKeys.settings,
    queryFn: adminApi.settings.get,
  })
}

export function useTaxRules() {
  return useQuery({
    queryKey: adminKeys.taxRules,
    queryFn: adminApi.settings.taxRules,
  })
}
