import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { LoginAside } from '@/features/admin/components/login-aside'

export function AdminLoginSkeleton() {
  return (
    <main className="bg-rice text-pine min-h-svh lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <LoginAside />

      <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <BrandLockup className="h-9" />
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft />
                Beranda
              </Link>
            </Button>
          </div>

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

            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Password</Label>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <Skeleton className="mt-2 h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </CardContent>
          </Card>

          <Skeleton className="mx-auto mt-6 h-4 w-64 max-w-full" />
        </div>
      </section>
    </main>
  )
}

export function CustomerMenuSkeleton() {
  return (
    <main className="bg-rice text-pine min-h-svh">
      <header className="border-pine/10 border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <BrandLockup className="h-8" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-5 h-12 w-2/3 max-w-md" />
        <Skeleton className="mt-3 h-4 w-1/2 max-w-sm" />
        <div className="mt-8 flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-card flex gap-3 rounded-2xl border p-4"
              >
                <Skeleton className="size-24 shrink-0 rounded-xl" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="mt-auto h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="hidden h-72 rounded-2xl lg:block" />
        </div>
      </div>
    </main>
  )
}

export function DisplaySkeleton() {
  return (
    <main className="bg-pine text-rice min-h-svh">
      <div className="mx-auto flex min-h-svh w-full max-w-[1920px] flex-col px-4 py-4 sm:px-6 lg:px-8 xl:px-10 xl:py-6">
        <header className="flex items-center justify-between gap-4">
          <BrandLockup variant="dark" className="h-8 xl:h-10" />
          <div className="flex items-center gap-3">
            <Skeleton className="bg-rice/10 h-9 w-24 rounded-full" />
            <Skeleton className="bg-rice/10 h-9 w-24 rounded-full" />
          </div>
        </header>
        <div className="mt-4 grid flex-1 gap-3 sm:gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="border-rice/12 bg-rice/[0.035] flex flex-col rounded-[1.75rem] border p-5"
            >
              <h2 className="font-display text-3xl leading-none font-bold tracking-[-0.03em] sm:text-4xl">
                {index === 0 ? 'Sedang disiapkan' : 'Siap diambil'}
              </h2>
              <p className="text-rice/65 mt-2 text-sm font-medium sm:text-base">
                {index === 0
                  ? 'Pesanan yang sudah dibayar sedang dikerjakan.'
                  : 'Silakan ambil pesanan saat nomormu tampil.'}
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                {Array.from({ length: 3 }).map((__, row) => (
                  <Skeleton key={row} className="bg-rice/10 h-20 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between gap-4">
          <Skeleton className="bg-rice/10 h-4 w-56" />
          <Skeleton className="bg-rice/10 h-4 w-32" />
        </div>
      </div>
    </main>
  )
}
