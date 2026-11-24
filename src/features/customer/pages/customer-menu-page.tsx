import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiError } from '@/lib/api/client'
import { ENABLE_PAYMENT_SIMULATOR } from '@/lib/env'
import { usePublicMenu, useQuote } from '../api/customer-api'
import type { PublicMenuItem } from '../api/types'
import { CartSheet } from '../components/cart-sheet'
import { CheckoutPanel } from '../components/checkout-panel'
import { CustomerTopBar } from '../components/customer-top-bar'
import { ItemSheet } from '../components/item-sheet'
import { MenuLoading, TableError } from '../components/menu-feedback'
import { MenuStage } from '../components/menu-stage'
import { PaymentPanel } from '../components/payment-panel'
import { useCustomerOrder } from '../hooks/use-customer-order'
import { toQuoteItems, totalQuantity } from '../lib/cart'
import { getCustomerErrorMessage } from '../lib/errors'
import { useCartStore, type CartLine } from '../stores/cart-store'

interface ItemSheetState {
  item: PublicMenuItem
  line: CartLine | null
}

export function CustomerMenuPage() {
  const { code = '' } = useParams()
  const tableCode = code.trim()
  const setTable = useCartStore((state) => state.setTable)
  const lines = useCartStore((state) => state.lines)
  const addLine = useCartStore((state) => state.addLine)
  const updateLine = useCartStore((state) => state.updateLine)
  const setQty = useCartStore((state) => state.setQty)
  const removeLine = useCartStore((state) => state.removeLine)
  const clearCart = useCartStore((state) => state.clear)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [cartOpen, setCartOpen] = useState(false)
  const [itemSheet, setItemSheet] = useState<ItemSheetState | null>(null)

  const menuQuery = usePublicMenu(tableCode)
  const quoteItems = useMemo(() => toQuoteItems(lines), [lines])
  const cartCount = totalQuantity(lines)
  const quoteQuery = useQuote(tableCode, quoteItems)
  const quote = quoteQuery.data
  const order = useCustomerOrder({ tableCode, quote, quoteItems })
  const menu = menuQuery.data

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
  const statusError = order.paymentStatus.error
    ? getCustomerErrorMessage(order.paymentStatus.error)
    : null
  const tableError =
    menuQuery.error instanceof ApiError && menuQuery.error.status === 404
      ? menuQuery.error.message
      : menuQuery.error
        ? getCustomerErrorMessage(menuQuery.error)
        : null

  function openItem(item: PublicMenuItem) {
    setItemSheet({ item, line: null })
  }

  function handleSaveLine(input: Parameters<typeof addLine>[0]) {
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

  function handleCheckout() {
    setCartOpen(false)
    order.startCheckout()
  }

  if (menuQuery.isPending) {
    return <MenuLoading />
  }

  if (tableError || !menu) {
    return (
      <TableError
        message={tableError ?? 'Meja tidak ditemukan atau sedang nonaktif.'}
      />
    )
  }

  if (order.stage === 'checkout') {
    return (
      <div className="bg-rice text-pine min-h-svh">
        <CustomerTopBar
          tableName={menu.table.name}
          cartCount={cartCount}
          showCart={false}
        />
        <CheckoutPanel
          tableName={menu.table.name}
          lines={lines}
          quote={quote}
          quoteLoading={quoteLoading}
          quoteError={quoteError}
          submitting={order.submitting}
          submitError={order.submitError}
          onBack={order.backToMenu}
          onSubmit={order.submitCheckout}
          onRetryQuote={() => void quoteQuery.refetch()}
        />
      </div>
    )
  }

  if (order.stage === 'payment' && order.activeOrder) {
    const activeOrder = order.activeOrder

    return (
      <div className="bg-rice text-pine min-h-svh">
        <CustomerTopBar
          tableName={menu.table.name}
          cartCount={cartCount}
          showCart={false}
        />
        <PaymentPanel
          order={activeOrder}
          tableName={menu.table.name}
          method={order.paymentMethod ?? 'CASH'}
          qris={order.qris}
          preparing={order.preparingQris}
          paymentError={order.paymentError}
          status={order.paymentStatus.data}
          statusLoading={order.paymentStatus.isPending}
          statusError={statusError}
          simulatorEnabled={ENABLE_PAYMENT_SIMULATOR}
          simulating={order.simulating}
          simulationError={order.simulationError}
          simulationNotice={order.simulationNotice}
          onRetryQris={() => void order.startQris(activeOrder)}
          onSwitchCash={order.switchToCash}
          onSimulatePayment={() => void order.simulatePayment(activeOrder)}
          onRefreshStatus={() => void order.paymentStatus.refetch()}
          onBackToMenu={order.backToMenu}
        />
      </div>
    )
  }

  return (
    <>
      <MenuStage
        menu={menu}
        search={search}
        activeCategory={activeCategory}
        cartCount={cartCount}
        hasLines={lines.length > 0}
        quote={quote}
        quoteLoading={quoteLoading}
        quoteError={quoteError}
        onSearchChange={setSearch}
        onCategoryChange={setActiveCategory}
        onSelectItem={openItem}
        onOpenCart={() => setCartOpen(true)}
      />

      {itemSheet ? (
        <ItemSheet
          key={`${itemSheet.item.id}:${itemSheet.line?.id ?? 'new'}`}
          item={itemSheet.item}
          line={itemSheet.line}
          open
          onOpenChange={(open) => {
            if (!open) {
              setItemSheet(null)
            }
          }}
          onSave={handleSaveLine}
        />
      ) : null}

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        tableName={menu.table.name}
        lines={lines}
        quote={quote}
        quoteLoading={quoteLoading}
        quoteError={quoteError}
        onEdit={handleEditLine}
        onRemove={removeLine}
        onQtyChange={setQty}
        onCheckout={handleCheckout}
        onRetryQuote={() => void quoteQuery.refetch()}
      />
    </>
  )
}
