import type { PublicCategory } from '../api/types'

export function filterMenuCategories(
  categories: PublicCategory[],
  search: string,
  activeCategory: string,
) {
  const needle = search.trim().toLowerCase()

  return categories
    .filter(
      (category) => activeCategory === 'all' || category.id === activeCategory,
    )
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        if (!needle) {
          return true
        }
        return (
          item.name.toLowerCase().includes(needle) ||
          (item.description ?? '').toLowerCase().includes(needle)
        )
      }),
    }))
    .filter((category) => category.items.length > 0)
}
