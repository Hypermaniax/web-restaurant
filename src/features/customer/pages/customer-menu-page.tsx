import { useParams } from 'react-router-dom'
import { CustomerCheckoutStage } from '../components/customer-checkout-stage'
import { CustomerMenuStage } from '../components/customer-menu-stage'
import { CustomerPaymentStage } from '../components/customer-payment-stage'
import { MenuLoading, TableError } from '../components/menu-feedback'
import { useCustomerMenuPage } from '../hooks/use-customer-menu-page'

export function CustomerMenuPage() {
  const { code = '' } = useParams()
  const tableCode = code.trim()
  const controller = useCustomerMenuPage(tableCode)
  const { menuQuery, menu, tableError, order } = controller

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
      <CustomerCheckoutStage
        tableName={menu.table.name}
        cartCount={controller.cart.count}
        lines={controller.cart.lines}
        quote={controller.quote.data}
        quoteLoading={controller.quote.loading}
        quoteError={controller.quote.error}
        controller={order}
        onRetryQuote={controller.quote.onRetry}
      />
    )
  }

  if (order.stage === 'payment' && order.activeOrder) {
    return (
      <CustomerPaymentStage
        tableName={menu.table.name}
        cartCount={controller.cart.count}
        activeOrder={order.activeOrder}
        controller={order}
      />
    )
  }

  return (
    <CustomerMenuStage
      menu={menu}
      catalog={controller.catalog}
      quote={controller.quote}
      cart={controller.cart}
      itemSheet={controller.itemSheet}
    />
  )
}
