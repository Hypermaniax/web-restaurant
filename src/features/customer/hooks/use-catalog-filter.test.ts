import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { PublicCategory, PublicMenuItem } from '../api/types'
import { useCatalogFilter } from './use-catalog-filter'

function menuItem(id: string, name: string): PublicMenuItem {
  return {
    id,
    name,
    description: null,
    price: 10000,
    imageUrl: null,
    isAvailable: true,
    sortOrder: 1,
    modifierGroups: [],
  }
}

const categories: PublicCategory[] = [
  {
    id: 'food',
    name: 'Makanan',
    sortOrder: 1,
    items: [menuItem('nasi', 'Nasi Goreng'), menuItem('mie', 'Mie Ayam')],
  },
  {
    id: 'drink',
    name: 'Minuman',
    sortOrder: 2,
    items: [menuItem('teh', 'Es Teh')],
  },
]

describe('useCatalogFilter', () => {
  it('returns all categories before filtering', () => {
    const { result } = renderHook(() => useCatalogFilter(categories))

    expect(result.current.search).toBe('')
    expect(result.current.activeCategory).toBe('all')
    expect(result.current.visibleCategories).toHaveLength(2)
  })

  it('filters items by search and category', () => {
    const { result } = renderHook(() => useCatalogFilter(categories))

    act(() => result.current.setSearch('ayam'))
    expect(result.current.visibleCategories).toHaveLength(1)
    expect(result.current.visibleCategories[0].items[0].name).toBe('Mie Ayam')

    act(() => result.current.setSearch(''))
    act(() => result.current.setActiveCategory('drink'))

    expect(result.current.visibleCategories).toHaveLength(1)
    expect(result.current.visibleCategories[0].name).toBe('Minuman')
  })

  it('resets search and category filters', () => {
    const { result } = renderHook(() => useCatalogFilter(categories))

    act(() => result.current.setSearch('teh'))
    act(() => result.current.setActiveCategory('drink'))
    act(() => result.current.resetFilters())

    expect(result.current.search).toBe('')
    expect(result.current.activeCategory).toBe('all')
    expect(result.current.visibleCategories).toHaveLength(2)
  })
})
