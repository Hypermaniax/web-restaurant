import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type { PageResult, Table, WithMessage } from '../types'
import { adminKeys } from './keys'
import { appendQuery, toPageQuery, type PageParams } from './query-utils'

export interface TableInput {
  code: string
  name: string
  zone?: string | null
  isActive?: boolean
}

export const tablesApi = {
  list: (includeInactive = false, page: PageParams = {}) =>
    apiRequest<PageResult<Table>>(
      appendQuery('/admin/tables', {
        includeInactive,
        ...toPageQuery(page),
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
}

export function useTables(includeInactive = false, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminKeys.tables, includeInactive, page, pageSize],
    queryFn: () => tablesApi.list(includeInactive, { page, pageSize }),
  })
}

export function useCashierTables() {
  return useQuery({
    queryKey: [...adminKeys.tables, 'cashier'],
    queryFn: tablesApi.cashierList,
  })
}
