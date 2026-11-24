import { zodResolver } from '@hookform/resolvers/zod'
import { renderHook, waitFor } from '@testing-library/react'
import { z } from 'zod'
import { useDialogForm } from './use-dialog-form'

const schema = z.object({
  name: z.string().min(1),
  isActive: z.boolean(),
})

type Values = z.infer<typeof schema>
type Entity = { id: string; name: string; isActive: boolean }

const emptyValues: Values = { name: '', isActive: true }

function toValues(entity: Entity): Values {
  return { name: entity.name, isActive: entity.isActive }
}

describe('useDialogForm', () => {
  it('loads entity values when the dialog opens for editing', async () => {
    const { result, rerender } = renderHook(
      ({ open, entity }: { open: boolean; entity: Entity | null }) =>
        useDialogForm({
          open,
          entity,
          resolver: zodResolver(schema),
          emptyValues,
          toValues,
        }),
      { initialProps: { open: false, entity: null as Entity | null } },
    )

    rerender({
      open: true,
      entity: { id: 'item-1', name: 'Kopi', isActive: false },
    })

    await waitFor(() => {
      expect(result.current.getValues()).toEqual({
        name: 'Kopi',
        isActive: false,
      })
    })
  })

  it('resets to empty values when the dialog opens for creating', async () => {
    const { result, rerender } = renderHook(
      ({ open, entity }: { open: boolean; entity: Entity | null }) =>
        useDialogForm({
          open,
          entity,
          resolver: zodResolver(schema),
          emptyValues,
          toValues,
        }),
      {
        initialProps: {
          open: false,
          entity: {
            id: 'item-1',
            name: 'Kopi',
            isActive: false,
          } as Entity | null,
        },
      },
    )

    rerender({ open: true, entity: null })

    await waitFor(() => {
      expect(result.current.getValues()).toEqual(emptyValues)
    })
  })
})
