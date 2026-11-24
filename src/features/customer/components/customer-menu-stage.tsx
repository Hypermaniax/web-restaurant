import type { PublicMenu, PublicMenuItem, QuoteTotals } from '../api/types'
import type { CatalogFilter } from '../hooks/use-catalog-filter'
import type { CartLine, CartLineInput } from '../stores/cart-store'
import { CartSheet } from './cart-sheet'
import { ItemSheet } from './item-sheet'
import { MenuStage } from './menu-stage'

export interface CustomerItemSheetState {
  item: PublicMenuItem
  line: CartLine | null
}

interface CustomerMenuStageProps {
  menu: PublicMenu
  catalog: CatalogFilter
  quote: {
    data: QuoteTotals | undefined
    loading: boolean
    error: string | null
    onRetry: () => void
  }
  cart: {
    count: number
    lines: CartLine[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onOpenCart: () => void
    onEdit: (line: CartLine) => void
    onRemove: (lineId: string) => void
    onQtyChange: (lineId: string, qty: number) => void
    onCheckout: () => void
  }
  itemSheet: {
    state: CustomerItemSheetState | null
    onSelectItem: (item: PublicMenuItem) => void
    onClose: () => void
    onSave: (input: CartLineInput) => void
  }
}

export function CustomerMenuStage({
  menu,
  catalog,
  quote,
  cart,
  itemSheet,
}: CustomerMenuStageProps) {
  return (
    <>
      <MenuStage
        menu={menu}
        catalog={catalog}
        cartCount={cart.count}
        hasLines={cart.lines.length > 0}
        quote={quote.data}
        quoteLoading={quote.loading}
        quoteError={quote.error}
        onSelectItem={itemSheet.onSelectItem}
        onOpenCart={cart.onOpenCart}
      />

      {itemSheet.state ? (
        <ItemSheet
          key={`${itemSheet.state.item.id}:${itemSheet.state.line?.id ?? 'new'}`}
          item={itemSheet.state.item}
          line={itemSheet.state.line}
          open
          onOpenChange={(open) => {
            if (!open) itemSheet.onClose()
          }}
          onSave={itemSheet.onSave}
        />
      ) : null}

      <CartSheet
        open={cart.open}
        onOpenChange={cart.onOpenChange}
        tableName={menu.table.name}
        lines={cart.lines}
        quote={quote.data}
        quoteLoading={quote.loading}
        quoteError={quote.error}
        onEdit={cart.onEdit}
        onRemove={cart.onRemove}
        onQtyChange={cart.onQtyChange}
        onCheckout={cart.onCheckout}
        onRetryQuote={quote.onRetry}
      />
    </>
  )
}
