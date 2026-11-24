import type { UseFormReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Banknote, QrCode } from 'lucide-react'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { PaymentMethod } from '../api/types'
import type { CheckoutFormValues } from '../lib/checkout-form'

interface CheckoutPaymentMethodsProps {
  form: UseFormReturn<CheckoutFormValues>
}

export function CheckoutPaymentMethods({ form }: CheckoutPaymentMethodsProps) {
  return (
    <FieldSet>
      <FieldLegend>Metode pembayaran</FieldLegend>
      <FieldDescription>
        QRIS langsung diproses. Tunai dibayar di kasir.
      </FieldDescription>
      <Controller
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={(value) => field.onChange(value as PaymentMethod)}
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <FieldLabel
              htmlFor="payment-qris"
              className="border-pine/10 bg-card hover:border-pine/25 has-data-[state=checked]:border-pine has-data-[state=checked]:bg-mint/50 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
            >
              <RadioGroupItem
                id="payment-qris"
                value="QRIS"
                className="mt-0.5"
              />
              <span className="flex flex-col gap-1">
                <span className="text-pine flex items-center gap-2 text-sm font-semibold">
                  <QrCode className="size-4" />
                  QRIS
                </span>
                <span className="text-pine/55 text-xs leading-5">
                  Scan QR dengan aplikasi pembayaran. Nomor antrian muncul
                  otomatis setelah lunas.
                </span>
              </span>
            </FieldLabel>

            <FieldLabel
              htmlFor="payment-cash"
              className="border-pine/10 bg-card hover:border-pine/25 has-data-[state=checked]:border-pine has-data-[state=checked]:bg-mint/50 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition"
            >
              <RadioGroupItem
                id="payment-cash"
                value="CASH"
                className="mt-0.5"
              />
              <span className="flex flex-col gap-1">
                <span className="text-pine flex items-center gap-2 text-sm font-semibold">
                  <Banknote className="size-4" />
                  Tunai di kasir
                </span>
                <span className="text-pine/55 text-xs leading-5">
                  Tunjukkan nomor order ke kasir. Nomor antrian muncul setelah
                  pembayaran dikonfirmasi.
                </span>
              </span>
            </FieldLabel>
          </RadioGroup>
        )}
      />
      <FieldError>{form.formState.errors.paymentMethod?.message}</FieldError>
    </FieldSet>
  )
}
