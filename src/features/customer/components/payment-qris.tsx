import type { QrisPayment } from '../api/types'
import { PaymentQrisActions } from './payment-qris-actions'
import { PaymentQrisCode } from './payment-qris-code'

interface PaymentQrisProps {
  qris: QrisPayment | null
  preparing: boolean
  paymentError: string | null
  statusError: string | null
  remainingMs: number
  qrisExpired: boolean
  simulatorEnabled: boolean
  simulating: boolean
  simulationError: string | null
  simulationNotice: string | null
  onRetryQris: () => void
  onSwitchCash: () => void
  onSimulatePayment: () => void
  onRefreshStatus: () => void
}

export function PaymentQris({
  qris,
  preparing,
  paymentError,
  statusError,
  remainingMs,
  qrisExpired,
  simulatorEnabled,
  simulating,
  simulationError,
  simulationNotice,
  onRetryQris,
  onSwitchCash,
  onSimulatePayment,
  onRefreshStatus,
}: PaymentQrisProps) {
  return (
    <div className="mt-6">
      <PaymentQrisCode
        preparing={preparing}
        paymentError={paymentError}
        qris={qris}
        remainingMs={remainingMs}
        qrisExpired={qrisExpired}
      />
      <PaymentQrisActions
        qris={qris}
        preparing={preparing}
        statusError={statusError}
        qrisExpired={qrisExpired}
        simulatorEnabled={simulatorEnabled}
        simulating={simulating}
        simulationError={simulationError}
        simulationNotice={simulationNotice}
        onRefreshStatus={onRefreshStatus}
        onRetryQris={onRetryQris}
        onSwitchCash={onSwitchCash}
        onSimulatePayment={onSimulatePayment}
      />
    </div>
  )
}
