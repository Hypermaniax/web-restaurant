import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminApi } from '../api/admin-api'
import { useAdminMutation } from '../hooks/use-admin-mutation'
import type { Staff } from '../api/types'
import { passwordSchema, type PasswordValues } from '../lib/staff-form'

interface StaffPasswordDialogProps {
  staff: Staff | null
  onOpenChange: (open: boolean) => void
}

export function StaffPasswordDialog({
  staff,
  onOpenChange,
}: StaffPasswordDialogProps) {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  })

  useEffect(() => {
    if (!staff) return
    form.reset({ password: '' })
  }, [form, staff])

  const resetMutation = useAdminMutation({
    mutationFn: (input: { id: string; password: string }) =>
      adminApi.staff.resetPassword(input.id, input.password),
    successMessage: 'Password direset',
    onSuccess: () => {
      onOpenChange(false)
      form.reset({ password: '' })
    },
  })

  return (
    <Dialog open={Boolean(staff)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            {staff
              ? `Password baru untuk ${staff.name}.`
              : 'Masukkan password baru.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit((values) => {
            if (!staff) return
            resetMutation.mutate({ id: staff.id, password: values.password })
          })}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="staff-new-password">Password baru</Label>
            <Input
              id="staff-new-password"
              type="password"
              autoComplete="new-password"
              {...form.register('password')}
            />
            {form.formState.errors.password ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={resetMutation.isPending}>
              {resetMutation.isPending ? 'Menyimpan...' : 'Reset password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
