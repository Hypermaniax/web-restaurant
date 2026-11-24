import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { SettingsValues } from '../lib/settings-form'
import { SettingsNumberField, SettingsSwitchRow } from './settings-fields'

interface SettingsTaxCardProps {
  form: UseFormReturn<SettingsValues>
}

export function SettingsTaxCard({ form }: SettingsTaxCardProps) {
  const values = useWatch({ control: form.control })

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold">
          Pajak & service
        </CardTitle>
        <CardDescription>
          Nilai ini dipakai server untuk menghitung order baru.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <SettingsSwitchRow
          id="tax-inclusive"
          label="Harga termasuk pajak"
          description="Pajak dihitung di dalam harga menu, bukan ditambahkan di akhir."
          checked={values.taxInclusive ?? false}
          onCheckedChange={(checked) => form.setValue('taxInclusive', checked)}
        />
        <SettingsSwitchRow
          id="tax-base-service"
          label="Pajak dihitung dari service"
          description="Service charge ikut menjadi dasar pengenaan pajak."
          checked={values.taxBaseIncludesService ?? false}
          onCheckedChange={(checked) =>
            form.setValue('taxBaseIncludesService', checked)
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsNumberField
            id="service-rate"
            label="Service charge (%)"
            step="0.01"
            error={form.formState.errors.serviceRate?.message}
            registration={form.register('serviceRate', {
              valueAsNumber: true,
            })}
          />
          <SettingsNumberField
            id="order-expiry"
            label="Expiry order (menit)"
            error={form.formState.errors.orderExpiryMinutes?.message}
            registration={form.register('orderExpiryMinutes', {
              valueAsNumber: true,
            })}
          />
          <SettingsNumberField
            id="cash-expiry"
            label="Expiry tunai (menit)"
            error={form.formState.errors.cashExpiryMinutes?.message}
            registration={form.register('cashExpiryMinutes', {
              valueAsNumber: true,
            })}
          />
        </div>

        <SettingsSwitchRow
          id="payment-before-kitchen"
          label="Wajib bayar sebelum masuk dapur"
          description="Order baru masuk KDS setelah pembayaran dikonfirmasi."
          checked={values.requirePaymentBeforeKitchen ?? true}
          onCheckedChange={(checked) =>
            form.setValue('requirePaymentBeforeKitchen', checked)
          }
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="receipt-footer">Footer struk</Label>
          <Textarea
            id="receipt-footer"
            placeholder="Terima kasih sudah makan di Rembuk."
            maxLength={500}
            aria-invalid={Boolean(form.formState.errors.receiptFooter)}
            {...form.register('receiptFooter')}
          />
          {form.formState.errors.receiptFooter ? (
            <p className="text-destructive text-sm">
              {form.formState.errors.receiptFooter.message}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
