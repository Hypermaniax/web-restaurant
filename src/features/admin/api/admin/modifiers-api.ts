import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type {
  ModifierGroup,
  PageResult,
  SelectionType,
  WithMessage,
} from '../types'
import { adminKeys } from './keys'
import { appendQuery, toPageQuery, type PageParams } from './query-utils'

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

export const modifiersApi = {
  list: (includeInactive = false, page: PageParams = {}) =>
    apiRequest<PageResult<ModifierGroup>>(
      appendQuery('/admin/modifier-groups', {
        includeInactive,
        ...toPageQuery(page),
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
}

export function useModifierGroups(includeInactive = false) {
  return useQuery({
    queryKey: [...adminKeys.modifiers, 'all', includeInactive],
    queryFn: () => modifiersApi.list(includeInactive, { all: true }),
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
    queryFn: () => modifiersApi.list(includeInactive, { page, pageSize }),
  })
}
