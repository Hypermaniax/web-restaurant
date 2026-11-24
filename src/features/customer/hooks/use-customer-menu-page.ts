import { useEffect, useMemo, useState } from 'react'
import { ApiError } from '@/lib/api/client'
import { usePublicMenu, useQuote } from '../api/customer-api'
import type { PublicMenuItem } from '../api/types'
import type { CustomerItemSheetState } from '../components/customer-menu-stage'
import { toQuoteItems, totalQuantity } from '../lib/cart'
import { getCustomerErrorMessage } from '../lib/errors'
import {
  useCartStore,
  type CartLine,
  type CartLineInput,
} from '../stores/cart-store'
import { useCatalogFilter } from './use-catalog-filter'
import { useCustomerOrder } from './use-customer-order'

export function useCustomerMenuPage(tableCode: string) {
  const setTable = useCartStore((state) => state.setTable)
  const lines = useCartStore((state) => state.lines)
  const addLine = useCartStore((state) => state.addLine)
  const updateLine = useCartStore((state) => state.updateLine)
  const setQty = useCartStore((state) => state.setQty)
  const removeLine = useCartStore((state) => state.removeLine)
  const clearCart = useCartStore((state) => state.clear)
  const [cartOpen, setCartOpen] = useState(false)
  const [itemSheet, setItemSheet] = useState<CustomerItemSheetState | null>(
    null,
  )

  const menuQuery = usePublicMenu(tableCode)
  const quoteItems = useMemo(() => toQuoteItems(lines), [lines])
  const cartCount = totalQuantity(lines)
  const quoteQuery = useQuote(tableCode, quoteItems)
  const quote = quoteQuery.data
  const order = useCustomerOrder({ tableCode, quote, quoteItems })
  const menu = menuQuery.data
  const catalog = useCatalogFilter(menu?.categories)

  useEffect(() => {
    if (tableCode) {
      setTable(tableCode)
    }
  }, [setTable, tableCode])

  useEffect(() => {
    if (order.paymentStatus.data?.status === 'PAID') {
      clearCart()
    }
  }, [clearCart, order.paymentStatus.data?.status])

  const quoteError = quoteQuery.error
    ? getCustomerErrorMessage(quoteQuery.error)
    : null
  const quoteLoading = quoteQuery.isFetching
  const tableError =
    menuQuery.error instanceof ApiError && menuQuery.error.status === 404
      ? menuQuery.error.message
      : menuQuery.error
        ? getCustomerErrorMessage(menuQuery.error)
        : null

  function openItem(item: PublicMenuItem) {
    setItemSheet({ item, line: null })
  }

  function closeItemSheet() {
    setItemSheet(null)
  }

  function handleSaveLine(input: CartLineInput) {
    if (itemSheet?.line) {
      updateLine(itemSheet.line.id, input)
    } else {
      addLine(input)
    }
    setItemSheet(null)
  }

  function handleEditLine(line: CartLine) {
    const item = menu?.categories
      .flatMap((category) => category.items)
      .find((candidate) => candidate.id === line.menuItemId)
    if (item) {
      setCartOpen(false)
      setItemSheet({ item, line })
    }
  }

  function openCart() {
    setCartOpen(true)
  }

  function handleCheckout() {
    setCartOpen(false)
    order.startCheckout()
  }

  return {
    menuQuery,
    menu,
    tableError,
    order,
    catalog,
    quote: {
      data: quote,
      loading: quoteLoading,
      error: quoteError,
      onRetry: () => void quoteQuery.refetch(),
    },
    cart: {
      count: cartCount,
      lines,
      open: cartOpen,
      onOpenChange: setCartOpen,
      onOpenCart: openCart,
      onEdit: handleEditLine,
      onRemove: removeLine,
      onQtyChange: setQty,
      onCheckout: handleCheckout,
    },
    itemSheet: {
      state: itemSheet,
      onSelectItem: openItem,
      onClose: closeItemSheet,
      onSave: handleSaveLine,
    },
  }
}
