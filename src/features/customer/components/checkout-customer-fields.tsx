import type { UseFormReturn } from 'react-hook-form'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CheckoutFormValues } from '../lib/checkout-form'

interface CheckoutCustomerFieldsProps {
  form: UseFormReturn<CheckoutFormValues>
}

export function CheckoutCustomerFields({ form }: CheckoutCustomerFieldsProps) {
  return (
    <>
      <div>
        <h2 className="font-display text-pine text-2xl font-bold tracking-tight">
          Detail pemesan
        </h2>
        <p className="text-pine/55 mt-2 text-sm leading-6">
          Nama dan catatan opsional. Kamu tidak perlu membuat akun.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="customer-name">Nama</FieldLabel>
          <Input
            id="customer-name"
            autoComplete="name"
            placeholder="Nama kamu"
            maxLength={80}
            aria-invalid={Boolean(form.formState.errors.customerName)}
            {...form.register('customerName')}
          />
          <FieldDescription>
            Biar kasir dan dapur mudah memanggil pesananmu.
          </FieldDescription>
          <FieldError>{form.formState.errors.customerName?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="customer-email">Email struk</FieldLabel>
          <Input
            id="customer-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nama@email.com"
            maxLength={254}
            aria-invalid={Boolean(form.formState.errors.customerEmail)}
            {...form.register('customerEmail')}
          />
          <FieldDescription>
            Opsional. Struk PDF dikirim ke email setelah pembayaran lunas.
          </FieldDescription>
          <FieldError>
            {form.formState.errors.customerEmail?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="order-notes">Catatan pesanan</FieldLabel>
          <Textarea
            id="order-notes"
            rows={3}
            maxLength={500}
            placeholder="Contoh: pesanan untuk 2 orang"
            className="bg-card border-pine/10 resize-none"
            aria-invalid={Boolean(form.formState.errors.notes)}
            {...form.register('notes')}
          />
          <FieldError>{form.formState.errors.notes?.message}</FieldError>
        </Field>
      </FieldGroup>
    </>
  )
}
