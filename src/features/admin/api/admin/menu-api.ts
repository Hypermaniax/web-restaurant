import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type { MenuItem, PageResult, WithMessage } from '../types'
import { adminKeys } from './keys'
import { appendQuery, toPageQuery, type PageParams } from './query-utils'

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

export const menuApi = {
  list: (includeInactive = false, page: PageParams = {}) =>
    apiRequest<PageResult<MenuItem>>(
      appendQuery('/admin/menu-items', {
        includeInactive,
        ...toPageQuery(page),
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
    return apiRequest<WithMessage<MenuItem>>(`/admin/menu-items/${id}/image`, {
      method: 'POST',
      body: form,
    })
  },
  remove: (id: string) =>
    apiRequest<WithMessage<MenuItem>>(`/admin/menu-items/${id}`, {
      method: 'DELETE',
    }),
}

export function useMenuItems(includeInactive = false, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminKeys.menu, includeInactive, page, pageSize],
    queryFn: () => menuApi.list(includeInactive, { page, pageSize }),
  })
}
