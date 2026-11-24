import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

interface ItemNotesFieldProps {
  notes: string
  onChange: (notes: string) => void
}

export function ItemNotesField({ notes, onChange }: ItemNotesFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="item-notes" className="text-pine font-semibold">
        Catatan untuk dapur
      </FieldLabel>
      <Textarea
        id="item-notes"
        value={notes}
        onChange={(event) => onChange(event.target.value)}
        maxLength={200}
        rows={3}
        placeholder="Contoh: tanpa bawang, saus terpisah"
        className="bg-card border-pine/10 resize-none"
      />
      <div className="text-pine/45 flex items-center justify-between gap-3 text-xs">
        <span>Opsional, maksimal 200 karakter.</span>
        <span className="tabular-nums">{notes.length}/200</span>
      </div>
    </Field>
  )
}
