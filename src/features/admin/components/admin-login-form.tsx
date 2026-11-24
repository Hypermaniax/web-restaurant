import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, LockKeyhole } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { canAccessAdmin, login, logout } from '@/lib/auth/session'
import { getErrorMessage } from '../lib/errors'
import { loginSchema, type LoginValues } from '../lib/login-form'

interface AdminLoginFormProps {
  redirectTo: string
}

export function AdminLoginForm({ redirectTo }: AdminLoginFormProps) {
  const navigate = useNavigate()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: LoginValues) => login(values.email, values.password),
    onSuccess: async (session) => {
      if (!canAccessAdmin(session.user.role)) {
        await logout()
        form.setError('root', {
          message:
            'Akun KITCHEN memakai aplikasi Flutter KDS. Gunakan akun ADMIN atau CASHIER untuk web.',
        })
        return
      }

      toast.success(session.message ?? 'Login berhasil')
      navigate(redirectTo, { replace: true })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  return (
    <Card className="border-pine/10 shadow-pine/5 shadow-xl">
      <CardHeader>
        <span className="bg-marigold text-pine mb-3 grid size-11 place-items-center rounded-2xl">
          <LockKeyhole className="size-5" />
        </span>
        <CardTitle className="font-display text-3xl font-bold tracking-[-0.04em]">
          Masuk ke Rembuk
        </CardTitle>
        <CardDescription>
          Gunakan email dan password staff yang sudah terdaftar.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@rembuk.local"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register('email')}
            />
            {form.formState.errors.email ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register('password')}
            />
            {form.formState.errors.password ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {form.formState.errors.root?.message ? (
            <p className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border px-3 py-2 text-sm leading-6">
              {form.formState.errors.root.message}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="mt-2 flex-col gap-3">
          <Button
            className="w-full"
            type="submit"
            variant="accent"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Memeriksa akun
              </>
            ) : (
              'Masuk'
            )}
          </Button>
          <Button asChild className="w-full" variant="ghost">
            <Link to="/">Kembali ke beranda</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
