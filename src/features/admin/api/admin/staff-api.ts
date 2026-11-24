import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type { UserRole } from '@/lib/auth/types'
import type { MessageResponse, PageResult, Staff, WithMessage } from '../types'
import { adminKeys } from './keys'
import { appendQuery, toPageQuery, type PageParams } from './query-utils'

export interface StaffInput {
  name: string
  email: string
  password: string
  role: UserRole
}

export const staffApi = {
  list: (page: PageParams = {}) =>
    apiRequest<PageResult<Staff>>(
      appendQuery('/admin/staff', toPageQuery(page)),
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
}

export function useStaff(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminKeys.staff, page, pageSize],
    queryFn: () => staffApi.list({ page, pageSize }),
  })
}
