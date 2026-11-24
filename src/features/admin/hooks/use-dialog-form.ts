import { useEffect } from 'react'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from 'react-hook-form'

interface UseDialogFormOptions<TValues extends FieldValues, TEntity> {
  open: boolean
  entity: TEntity | null
  resolver: Resolver<TValues>
  emptyValues: DefaultValues<TValues>
  toValues: (entity: TEntity) => TValues
}

export function useDialogForm<TValues extends FieldValues, TEntity>({
  open,
  entity,
  resolver,
  emptyValues,
  toValues,
}: UseDialogFormOptions<TValues, TEntity>): UseFormReturn<TValues> {
  const form = useForm<TValues>({
    resolver,
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!open) return
    form.reset(entity ? toValues(entity) : emptyValues)
  }, [emptyValues, entity, form, open, toValues])

  return form
}
