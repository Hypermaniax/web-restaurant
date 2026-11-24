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
import type { PublicMenuItem } from '../api/types'
import type { CatalogFilter } from '../hooks/use-catalog-filter'
import { MenuItemRow } from './menu-item-row'

interface MenuCatalogProps {
  catalog: CatalogFilter
  onSelectItem: (item: PublicMenuItem) => void
}

export function MenuCatalog({ catalog, onSelectItem }: MenuCatalogProps) {
  const {
    categories,
    search,
    activeCategory,
    visibleCategories,
    setSearch,
    setActiveCategory,
    resetFilters,
  } = catalog

  return (
    <>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="relative">
          <Search className="text-pine/40 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
            onClick={() => setActiveCategory('all')}
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
              onClick={() => setActiveCategory(category.id)}
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
                <Button type="button" variant="outline" onClick={resetFilters}>
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
