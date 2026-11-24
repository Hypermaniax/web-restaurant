import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaymentStatusRefreshProps {
  loading: boolean
  error: string | null
  onRefresh: () => void
}

export function PaymentStatusRefresh({
  loading,
  error,
  onRefresh,
}: PaymentStatusRefreshProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        aria-busy={loading}
        className="self-start"
      >
        <RefreshCw data-icon="inline-start" />
        Cek status
      </Button>
      {error ? (
        <p className="text-chili text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
