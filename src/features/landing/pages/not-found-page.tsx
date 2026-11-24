import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="bg-rice text-pine grid min-h-svh place-items-center px-5 py-10">
      <div className="w-full max-w-lg text-center">
        <BrandLockup className="mx-auto h-9" />
        <p className="font-display text-chili mt-10 text-8xl font-bold tracking-[-0.08em]">
          404
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight">
          Halaman tidak ditemukan
        </h1>
        <p className="text-pine/60 mt-3 text-sm leading-6">
          Alamat yang kamu buka tidak tersedia. Kembali ke beranda atau scan QR
          meja kembali.
        </p>
        <Button asChild className="mt-7" variant="accent">
          <Link to="/">
            <ArrowLeft />
            Kembali ke beranda
          </Link>
        </Button>
      </div>
    </main>
  )
}
