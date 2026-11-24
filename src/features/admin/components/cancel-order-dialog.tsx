import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Order } from '../api/orders-api'

interface CancelOrderDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  isPending: boolean
}

export function CancelOrderDialog({
  order,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState('')
  const trimmedReason = reason.trim()

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setReason('')
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batalkan order?</DialogTitle>
          <DialogDescription>
            Order {order?.orderNumber ?? ''} belum dibayar. Pembatalan akan
            mengosongkan nomor antrian dan tidak bisa dikembalikan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cancel-reason">Alasan pembatalan</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Contoh: pelanggan membatalkan pesanan"
            maxLength={300}
            aria-invalid={reason.length > 0 && trimmedReason.length === 0}
          />
          <p className="text-muted-foreground text-xs">
            {reason.length}/300 karakter
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Kembali
          </Button>
          <Button
            variant="destructive"
            disabled={isPending || trimmedReason.length === 0}
            onClick={() => onConfirm(trimmedReason)}
          >
            {isPending ? 'Membatalkan...' : 'Batalkan order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
