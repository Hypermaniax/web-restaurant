import { useMemo } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import type { PublicCategory, PublicMenuItem } from '../api/types'
import { filterMenuCategories } from '../lib/menu'
import { MenuItemRow } from './menu-item-row'

interface MenuCatalogProps {
  categories: PublicCategory[]
  search: string
  activeCategory: string
  onSearchChange: (search: string) => void
  onCategoryChange: (categoryId: string) => void
  onSelectItem: (item: PublicMenuItem) => void
}

export function MenuCatalog({
  categories,
  search,
  activeCategory,
  onSearchChange,
  onCategoryChange,
  onSelectItem,
}: MenuCatalogProps) {
  const visibleCategories = useMemo(
    () => filterMenuCategories(categories, search, activeCategory),
    [activeCategory, categories, search],
  )

  return (
    <>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="relative">
          <Search className="text-pine/40 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari menu…"
            aria-label="Cari menu"
            className="bg-card border-pine/10 h-11 pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            type="button"
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            className="shrink-0 rounded-full"
            onClick={() => onCategoryChange('all')}
          >
            Semua
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className="shrink-0 rounded-full"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-10">
        {visibleCategories.length === 0 ? (
          <Empty className="border-pine/10 bg-card border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>
                {search ? 'Menu tidak ditemukan' : 'Menu belum tersedia'}
              </EmptyTitle>
              <EmptyDescription>
                {search
                  ? 'Coba kata kunci lain atau lihat semua kategori.'
                  : 'Belum ada menu aktif untuk meja ini.'}
              </EmptyDescription>
            </EmptyHeader>
            {search ? (
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onSearchChange('')
                    onCategoryChange('all')
                  }}
                >
                  Hapus pencarian
                </Button>
              </EmptyContent>
            ) : null}
          </Empty>
        ) : (
          visibleCategories.map((category) => (
            <section key={category.id}>
              <div className="border-pine/10 flex items-baseline justify-between gap-4 border-b pb-3">
                <h2 className="font-display text-pine text-2xl font-bold tracking-tight">
                  {category.name}
                </h2>
                <span className="text-pine/45 text-xs">
                  {category.items.length} menu
                </span>
              </div>
              <div className="divide-pine/10 flex flex-col divide-y">
                {category.items.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    onSelect={onSelectItem}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  )
}
