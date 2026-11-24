import { Badge } from '@/components/ui/badge'
import type { PublicMenu, PublicMenuItem, QuoteTotals } from '../api/types'
import type { CatalogFilter } from '../hooks/use-catalog-filter'
import { CustomerTopBar } from './customer-top-bar'
import { MenuCatalog } from './menu-catalog'
import { MenuOrderSummary, MobileCartBar } from './menu-order-summary'

interface MenuStageProps {
  menu: PublicMenu
  catalog: CatalogFilter
  cartCount: number
  hasLines: boolean
  quote: QuoteTotals | undefined
  quoteLoading: boolean
  quoteError: string | null
  onSelectItem: (item: PublicMenuItem) => void
  onOpenCart: () => void
}

export function MenuStage({
  menu,
  catalog,
  cartCount,
  hasLines,
  quote,
  quoteLoading,
  quoteError,
  onSelectItem,
  onOpenCart,
}: MenuStageProps) {
  return (
    <div className="bg-rice text-pine min-h-svh pb-28">
      <CustomerTopBar
        tableName={menu.table.name}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        showCart
      />

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section className="relative overflow-hidden py-9 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(242,169,59,0.18),transparent_28%),radial-gradient(circle_at_8%_70%,rgba(220,232,223,0.7),transparent_35%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Dine-in</Badge>
                <Badge variant="outline">{menu.outlet.name}</Badge>
                {menu.table.zone ? (
                  <Badge variant="outline">{menu.table.zone}</Badge>
                ) : null}
              </div>
              <h1 className="font-display text-pine mt-5 text-6xl leading-[0.9] font-bold tracking-[-0.055em] sm:text-7xl">
                {menu.table.name}
              </h1>
              <p className="text-pine/65 mt-4 max-w-xl text-base leading-7">
                Pilih menu, bayar dengan QRIS atau tunai, lalu tunggu nomor
                antrian. Tidak perlu login.
              </p>
            </div>

            <div className="border-pine/10 bg-card/80 hidden rounded-2xl border p-4 backdrop-blur sm:block">
              <p className="text-pine/45 text-xs">Kode meja</p>
              <p className="font-display text-pine mt-1 text-3xl font-bold tracking-[-0.04em]">
                {menu.table.code}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <MenuCatalog catalog={catalog} onSelectItem={onSelectItem} />
          </div>

          <MenuOrderSummary
            cartCount={cartCount}
            hasLines={hasLines}
            quote={quote}
            quoteLoading={quoteLoading}
            quoteError={quoteError}
            onOpenCart={onOpenCart}
          />
        </div>
      </main>

      {cartCount > 0 ? (
        <MobileCartBar
          cartCount={cartCount}
          quote={quote}
          quoteLoading={quoteLoading}
          onOpenCart={onOpenCart}
        />
      ) : null}
    </div>
  )
}
