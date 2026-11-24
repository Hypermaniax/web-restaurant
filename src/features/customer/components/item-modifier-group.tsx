import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Toggle } from '@/components/ui/toggle'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PublicModifierGroup, PublicModifierOption } from '../api/types'
import { selectionHint, selectionRange } from '../lib/item-selection'

interface ItemModifierGroupProps {
  group: PublicModifierGroup
  value: string[]
  error: string | undefined
  showError: boolean
  onToggle: (group: PublicModifierGroup, option: PublicModifierOption) => void
}

export function ItemModifierGroup({
  group,
  value,
  error,
  showError,
  onToggle,
}: ItemModifierGroupProps) {
  const { max } = selectionRange(group)
  const maxReached =
    group.selectionType === 'MULTIPLE' &&
    max !== undefined &&
    value.length >= max

  return (
    <FieldGroup className="gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <FieldLabel className="text-pine text-sm font-semibold">
            {group.name}
          </FieldLabel>
          <FieldDescription className="mt-1 text-xs">
            {selectionHint(group)}
          </FieldDescription>
        </div>
        <Badge variant={group.isRequired ? 'default' : 'secondary'}>
          {group.isRequired ? 'Wajib' : 'Opsional'}
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        {group.options.map((option) => {
          const isSelected = value.includes(option.id)
          const disabled =
            group.selectionType === 'MULTIPLE' &&
            !isSelected &&
            maxReached &&
            max !== undefined

          return (
            <Toggle
              key={option.id}
              pressed={isSelected}
              onPressedChange={() => onToggle(group, option)}
              disabled={disabled}
              variant="outline"
              className="border-pine/10 data-[state=on]:border-pine/25 flex h-auto w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left whitespace-normal"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    'border-pine/20 grid size-5 shrink-0 place-items-center rounded',
                    isSelected
                      ? 'bg-pine text-rice border-pine'
                      : 'bg-transparent',
                    group.selectionType === 'SINGLE' && 'rounded-full',
                  )}
                >
                  {isSelected ? <Check className="size-3" /> : null}
                </span>
                <span>{option.name}</span>
              </span>
              {option.priceDelta !== 0 ? (
                <span className="text-pine/60 shrink-0 text-xs font-medium tabular-nums">
                  {option.priceDelta > 0 ? '+' : ''}
                  {formatCurrency(option.priceDelta)}
                </span>
              ) : null}
            </Toggle>
          )
        })}
      </div>

      {showError && error ? <FieldError>{error}</FieldError> : null}
    </FieldGroup>
  )
}
