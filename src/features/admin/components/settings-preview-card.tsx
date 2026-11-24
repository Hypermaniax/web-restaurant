import { Info, Save } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'
import { calculatePreview } from '../lib/settings-preview'
import type { SettingsValues } from '../lib/settings-form'
import { SettingsPreviewRow } from './settings-fields'

interface SettingsPreviewCardProps {
  form: UseFormReturn<SettingsValues>
  isSaving: boolean
}

export function SettingsPreviewCard({
  form,
  isSaving,
}: SettingsPreviewCardProps) {
  const values = useWatch({ control: form.control })
  const [exampleSubtotal, setExampleSubtotal] = useState('')
  const [previewType, setPreviewType] = useState<'DINE_IN' | 'TAKEAWAY'>(
    'DINE_IN',
  )
  const previewTaxEnabled =
    previewType === 'DINE_IN'
      ? values.dineInTaxEnabled
      : values.takeawayTaxEnabled
  const previewTaxRate =
    previewType === 'DINE_IN' ? values.dineInTaxRate : values.takeawayTaxRate
  const preview = calculatePreview({
    subtotal: Number(exampleSubtotal) || 0,
    orderType: previewType,
    serviceRate: values.serviceRate ?? 0,
    taxRate: previewTaxEnabled ? (previewTaxRate ?? 0) : 0,
    taxInclusive: values.taxInclusive ?? false,
    taxBaseIncludesService: values.taxBaseIncludesService ?? false,
  })

  return (
    <Card className="gap-4 lg:sticky lg:top-8">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold">
          Preview perhitungan
        </CardTitle>
        <CardDescription>
          Contoh dihitung dari nilai form, bukan total order final.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="preview-type">Tipe order contoh</Label>
          <Select
            value={previewType}
            onValueChange={(value) =>
              setPreviewType(value as 'DINE_IN' | 'TAKEAWAY')
            }
          >
            <SelectTrigger id="preview-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DINE_IN">Dine-in</SelectItem>
              <SelectItem value="TAKEAWAY">Takeaway</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="example-subtotal">Subtotal contoh</Label>
          <Input
            id="example-subtotal"
            type="number"
            min={0}
            value={exampleSubtotal}
            placeholder="0"
            onChange={(event) => setExampleSubtotal(event.target.value)}
          />
        </div>

        <div className="bg-muted/40 rounded-xl p-4 text-sm">
          <div className="flex flex-col gap-2">
            <SettingsPreviewRow label="Subtotal" value={preview.subtotal} />
            {preview.service > 0 ? (
              <SettingsPreviewRow label="Service" value={preview.service} />
            ) : null}
            <SettingsPreviewRow label="Pajak" value={preview.tax} />
            <Separator />
            <div className="text-pine flex items-center justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(preview.total)}</span>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground flex items-start gap-2 text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <p>
            Preview memakai subtotal contoh. Total order sebenarnya selalu
            dihitung server saat checkout.
          </p>
        </div>

        <Button
          type="submit"
          variant="accent"
          className="w-full"
          disabled={isSaving}
        >
          <Save />
          {isSaving ? 'Menyimpan...' : 'Simpan pengaturan'}
        </Button>
      </CardContent>
    </Card>
  )
}
