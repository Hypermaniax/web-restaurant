import { ENABLE_PAYMENT_SIMULATOR } from '@/lib/env'
import type { CreatedOrder } from '../api/types'
import type { CustomerOrderController } from '../hooks/use-customer-order'
import { getCustomerErrorMessage } from '../lib/errors'
import { CustomerStageShell } from './customer-stage-shell'
import { PaymentPanel } from './payment-panel'

interface CustomerPaymentStageProps {
  tableName: string
  cartCount: number
  activeOrder: CreatedOrder
  controller: CustomerOrderController
}

export function CustomerPaymentStage({
  tableName,
  cartCount,
  activeOrder,
  controller,
}: CustomerPaymentStageProps) {
  const statusError = controller.paymentStatus.error
    ? getCustomerErrorMessage(controller.paymentStatus.error)
    : null

  return (
    <CustomerStageShell tableName={tableName} cartCount={cartCount}>
      <PaymentPanel
        order={activeOrder}
        tableName={tableName}
        method={controller.paymentMethod ?? 'CASH'}
        qris={controller.qris}
        preparing={controller.preparingQris}
        paymentError={controller.paymentError}
        status={controller.paymentStatus.data}
        statusLoading={controller.paymentStatus.isPending}
        statusError={statusError}
        simulatorEnabled={ENABLE_PAYMENT_SIMULATOR}
        simulating={controller.simulating}
        simulationError={controller.simulationError}
        simulationNotice={controller.simulationNotice}
        onRetryQris={() => void controller.startQris(activeOrder)}
        onSwitchCash={controller.switchToCash}
        onSimulatePayment={() => void controller.simulatePayment(activeOrder)}
        onRefreshStatus={() => void controller.paymentStatus.refetch()}
        onBackToMenu={controller.backToMenu}
      />
    </CustomerStageShell>
  )
}
