import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '../lib/errors'

interface UseAdminMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>
  successMessage?: string
  invalidateKeys?: readonly QueryKey[]
  onSuccess?: (data: TData, variables: TVariables) => void
}

function getSuccessMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = data.message
    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }
  }
  return fallback
}

export function useAdminMutation<TData, TVariables>({
  mutationFn,
  successMessage,
  invalidateKeys = [],
  onSuccess,
}: UseAdminMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (successMessage) {
        toast.success(getSuccessMessage(data, successMessage))
      }
      invalidateKeys.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey })
      })
      onSuccess?.(data, variables)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
