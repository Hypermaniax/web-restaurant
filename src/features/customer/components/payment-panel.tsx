import { useNow } from '../hooks/use-now'
import type {
  CreatedOrder,
  PaymentMethod,
  PublicPaymentStatus,
  QrisPayment,
} from '../api/types'
import { PaymentCash } from './payment-cash'
import { PaymentExpired } from './payment-expired'
import { PaymentMethodHeader } from './payment-method-header'
import { PaymentOrderMeta } from './payment-order-meta'
import { PaymentPaid } from './payment-paid'
import { PaymentQris } from './payment-qris'

interface PaymentPanelProps {
  order: CreatedOrder
  tableName: string
  method: PaymentMethod
  qris: QrisPayment | null
  preparing: boolean
  paymentError: string | null
  status: PublicPaymentStatus | undefined
  statusLoading: boolean
  statusError: string | null
  simulatorEnabled: boolean
  simulating: boolean
  simulationError: string | null
  simulationNotice: string | null
  onRetryQris: () => void
  onSwitchCash: () => void
  onSimulatePayment: () => void
  onRefreshStatus: () => void
  onBackToMenu: () => void
}

export function PaymentPanel({
  order,
  tableName,
  method,
  qris,
  preparing,
  paymentError,
  status,
  statusLoading,
  statusError,
  simulatorEnabled,
  simulating,
  simulationError,
  simulationNotice,
  onRetryQris,
  onSwitchCash,
  onSimulatePayment,
  onRefreshStatus,
  onBackToMenu,
}: PaymentPanelProps) {
  const now = useNow(
    method === 'QRIS' && Boolean(qris) && status?.status !== 'PAID',
  )
  const paymentState = status?.status ?? order.paymentStatus
  const isPaid = paymentState === 'PAID'
  const isExpired =
    paymentState === 'EXPIRED' ||
    paymentState === 'CANCELLED' ||
    paymentState === 'FAILED'
  const isQris = method === 'QRIS'
  const remainingMs = qris ? new Date(qris.expiresAt).getTime() - now : 0
  const qrisExpired = isQris && Boolean(qris) && remainingMs <= 0

  if (isPaid) {
    return (
      <PaymentPaid
        order={order}
        tableName={tableName}
        queueDisplay={status?.queueDisplay ?? order.queueDisplay}
        onBackToMenu={onBackToMenu}
      />
    )
  }

  if (isExpired) {
    return (
      <PaymentExpired
        order={order}
        tableName={tableName}
        paymentState={paymentState}
        onBackToMenu={onBackToMenu}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-4 pb-10 sm:px-8">
      <div className="border-pine/10 bg-card shadow-pine/10 rounded-[2rem] border p-6 shadow-2xl sm:p-9">
        <PaymentMethodHeader isQris={isQris} />

        <div className="mt-6">
          <PaymentOrderMeta order={order} tableName={tableName} />
        </div>

        {isQris ? (
          <PaymentQris
            qris={qris}
            preparing={preparing}
            paymentError={paymentError}
            statusError={statusError}
            remainingMs={remainingMs}
            qrisExpired={qrisExpired}
            simulatorEnabled={simulatorEnabled}
            simulating={simulating}
            simulationError={simulationError}
            simulationNotice={simulationNotice}
            onRetryQris={onRetryQris}
            onSwitchCash={onSwitchCash}
            onSimulatePayment={onSimulatePayment}
            onRefreshStatus={onRefreshStatus}
          />
        ) : (
          <PaymentCash
            order={order}
            statusLoading={statusLoading}
            statusError={statusError}
            onRefreshStatus={onRefreshStatus}
          />
        )}

        <p className="text-pine/40 mt-6 text-center text-xs leading-5">
          Status diperbarui otomatis setiap beberapa detik. Jangan tutup halaman
          sebelum pembayaran selesai.
        </p>
      </div>
    </div>
  )
}
