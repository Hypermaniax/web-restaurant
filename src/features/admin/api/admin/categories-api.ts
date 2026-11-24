import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api/client'
import type { Category, PageResult, WithMessage } from '../types'
import { adminKeys } from './keys'
import { appendQuery, toPageQuery, type PageParams } from './query-utils'

export interface CategoryInput {
  name: string
  sortOrder: number
  isActive?: boolean
}

export const categoriesApi = {
  list: (includeInactive = false, page: PageParams = {}) =>
    apiRequest<PageResult<Category>>(
      appendQuery('/admin/categories', {
        includeInactive,
        ...toPageQuery(page),
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
}

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: [...adminKeys.categories, 'all', includeInactive],
    queryFn: () => categoriesApi.list(includeInactive, { all: true }),
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
    queryFn: () => categoriesApi.list(includeInactive, { page, pageSize }),
  })
}
