import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LandingPreview } from './landing-preview'

export function LandingHero() {
  return (
    <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
      <div>
        <p className="text-chili flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
          <span className="bg-chili size-2 rounded-full" />
          Dine-in · QR · Tanpa login
        </p>
        <h1 className="font-display text-pine mt-5 max-w-2xl text-5xl leading-[0.95] font-bold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          Makan,
          <br />
          <span className="text-chili">tanpa ribet.</span>
        </h1>
        <p className="text-pine/70 mt-6 max-w-xl text-base leading-7 sm:text-lg">
          Pesan langsung dari meja, bayar dengan QRIS atau tunai, lalu tunggu
          nomor antrian. Satu alur dari meja ke dapur.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link to="/admin/login">
              Masuk admin
              <ArrowUpRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/display">Lihat layar antrian</Link>
          </Button>
        </div>

        <p className="text-pine/55 mt-6 text-sm">
          Akses pelanggan dibuat lewat QR meja yang tercetak dari panel admin.
        </p>
      </div>

      <LandingPreview />
    </section>
  )
}
