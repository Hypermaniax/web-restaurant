import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAdminMutation } from './use-admin-mutation'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
}

function wrapperFor(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useAdminMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the server message, invalidates keys, and runs the callback', async () => {
    const queryClient = createQueryClient()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const success = vi.spyOn(toast, 'success')
    const onSuccess = vi.fn()

    const { result } = renderHook(
      () =>
        useAdminMutation({
          mutationFn: async () => ({ message: 'Menu dibuat' }),
          successMessage: 'Menu diperbarui',
          invalidateKeys: [['admin', 'menu']],
          onSuccess,
        }),
      { wrapper: wrapperFor(queryClient) },
    )

    await act(async () => {
      await result.current.mutateAsync(undefined)
    })

    expect(success).toHaveBeenCalledWith('Menu dibuat')
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['admin', 'menu'],
    })
    expect(onSuccess).toHaveBeenCalledWith(
      { message: 'Menu dibuat' },
      undefined,
    )
  })

  it('uses the fallback message when the response has no message', async () => {
    const queryClient = createQueryClient()
    const success = vi.spyOn(toast, 'success')

    const { result } = renderHook(
      () =>
        useAdminMutation({
          mutationFn: async () => ({}),
          successMessage: 'Disimpan',
        }),
      { wrapper: wrapperFor(queryClient) },
    )

    await act(async () => {
      await result.current.mutateAsync(undefined)
    })

    expect(success).toHaveBeenCalledWith('Disimpan')
  })

  it('does not show a success toast when no message is configured', async () => {
    const queryClient = createQueryClient()
    const success = vi.spyOn(toast, 'success')

    const { result } = renderHook(
      () =>
        useAdminMutation({
          mutationFn: async () => ({}),
        }),
      { wrapper: wrapperFor(queryClient) },
    )

    await act(async () => {
      await result.current.mutateAsync(undefined)
    })

    expect(success).not.toHaveBeenCalled()
  })

  it('reports mutation errors', async () => {
    const queryClient = createQueryClient()
    const success = vi.spyOn(toast, 'success')
    const error = vi.spyOn(toast, 'error')

    const { result } = renderHook(
      () =>
        useAdminMutation({
          mutationFn: async () => {
            throw new Error('Gagal menyimpan')
          },
          successMessage: 'Disimpan',
        }),
      { wrapper: wrapperFor(queryClient) },
    )

    await act(async () => {
      await expect(result.current.mutateAsync(undefined)).rejects.toThrow(
        'Gagal menyimpan',
      )
    })

    expect(success).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalledWith('Gagal menyimpan')
  })
})
