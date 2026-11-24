import { useCallback, useMemo, useState } from 'react'
import type { PublicCategory } from '../api/types'
import { filterMenuCategories } from '../lib/menu'

const ALL_CATEGORIES = 'all'
const EMPTY_CATEGORIES: PublicCategory[] = []

export interface CatalogFilter {
  categories: PublicCategory[]
  search: string
  activeCategory: string
  visibleCategories: PublicCategory[]
  setSearch: (search: string) => void
  setActiveCategory: (categoryId: string) => void
  resetFilters: () => void
}

export function useCatalogFilter(
  categories: PublicCategory[] = EMPTY_CATEGORIES,
): CatalogFilter {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)

  const visibleCategories = useMemo(
    () => filterMenuCategories(categories, search, activeCategory),
    [activeCategory, categories, search],
  )

  const updateSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const updateCategory = useCallback((categoryId: string) => {
    setActiveCategory(categoryId)
  }, [])

  const resetFilters = useCallback(() => {
    setSearch('')
    setActiveCategory(ALL_CATEGORIES)
  }, [])

  return {
    categories,
    search,
    activeCategory,
    visibleCategories,
    setSearch: updateSearch,
    setActiveCategory: updateCategory,
    resetFilters,
  }
}
