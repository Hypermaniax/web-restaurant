import { Banknote, FlaskConical, QrCode, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { QrisPayment } from '../api/types'

interface PaymentQrisActionsProps {
  qris: QrisPayment | null
  preparing: boolean
  statusError: string | null
  qrisExpired: boolean
  simulatorEnabled: boolean
  simulating: boolean
  simulationError: string | null
  simulationNotice: string | null
  onRefreshStatus: () => void
  onRetryQris: () => void
  onSwitchCash: () => void
  onSimulatePayment: () => void
}

export function PaymentQrisActions({
  qris,
  preparing,
  statusError,
  qrisExpired,
  simulatorEnabled,
  simulating,
  simulationError,
  simulationNotice,
  onRefreshStatus,
  onRetryQris,
  onSwitchCash,
  onSimulatePayment,
}: PaymentQrisActionsProps) {
  return (
    <>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="accent"
          size="lg"
          className="flex-1"
          onClick={qris ? onRefreshStatus : onRetryQris}
          disabled={preparing}
        >
          {qris ? (
            <RefreshCw data-icon="inline-start" />
          ) : (
            <QrCode data-icon="inline-start" />
          )}
          {qris ? 'Cek status' : 'Coba QRIS lagi'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onSwitchCash}
        >
          <Banknote data-icon="inline-start" />
          Bayar tunai
        </Button>
      </div>

      {simulatorEnabled && qris ? (
        <div className="border-pine/15 bg-pine/5 mt-3 rounded-xl border border-dashed p-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={onSimulatePayment}
            disabled={preparing || simulating || qrisExpired}
          >
            <FlaskConical data-icon="inline-start" />
            {simulating ? 'Mengirim simulasi...' : 'Simulasikan bayar (test)'}
          </Button>
          <p className="text-muted-foreground mt-2 text-center text-xs leading-5">
            Khusus Xendit test mode. Status tetap ditentukan oleh webhook.
          </p>
          {simulationNotice ? (
            <p className="text-pine mt-1 text-center text-xs" role="status">
              {simulationNotice}
            </p>
          ) : null}
          {simulationError ? (
            <p className="text-chili mt-1 text-center text-xs" role="alert">
              {simulationError}
            </p>
          ) : null}
        </div>
      ) : null}

      {qris ? (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRetryQris}
            disabled={preparing}
          >
            Buat QR baru
          </Button>
          {statusError ? (
            <p className="text-chili text-xs" role="alert">
              {statusError}
            </p>
          ) : null}
        </div>
      ) : statusError ? (
        <p className="text-chili mt-3 text-xs" role="alert">
          {statusError}
        </p>
      ) : null}
    </>
  )
}
