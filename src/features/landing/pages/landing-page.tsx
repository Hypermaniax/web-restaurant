import { ArrowUpRight, LayoutDashboard, Monitor } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Button } from '@/components/ui/button'

const entryPoints = [
  {
    title: 'Admin back-office',
    description: 'Kelola menu, meja, QR, staff, laporan, dan pengaturan.',
    href: '/admin/login',
    action: 'Masuk admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Layar antrian',
    description: 'Monitor publik untuk nomor antrian yang siap diambil.',
    href: '/display',
    action: 'Buka display',
    icon: Monitor,
  },
]

export function LandingPage() {
  return (
    <main className="bg-rice text-pine relative min-h-svh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(242,169,59,0.2),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(220,232,223,0.8),transparent_32%),linear-gradient(135deg,rgba(255,253,248,0.7),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-svh w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between gap-6">
          <BrandLockup className="h-9" />
          <span className="border-pine/10 text-pine/70 rounded-full border bg-white/60 px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur">
            Sistem pesan restoran
          </span>
        </header>

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
              Pesan langsung dari meja, bayar dengan QRIS atau tunai, lalu
              tunggu nomor antrian. Satu alur dari meja ke dapur.
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
              Akses pelanggan dibuat lewat QR meja yang tercetak dari panel
              admin.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-marigold/70 absolute -top-5 -right-3 h-24 w-24 rotate-6 rounded-3xl blur-sm" />
            <div className="border-pine/10 shadow-pine/10 relative rounded-[2rem] border bg-white/80 p-4 shadow-2xl backdrop-blur">
              <div className="bg-pine text-rice rounded-[1.5rem] p-5">
                <div className="text-rice/60 flex items-center justify-between text-xs font-semibold tracking-[0.16em] uppercase">
                  <span>Pesan dari meja</span>
                  <span>QR</span>
                </div>
                <p className="font-display mt-10 text-4xl leading-tight font-bold tracking-[-0.05em]">
                  Scan. Pilih.
                  <br />
                  Bayar.
                </p>
                <p className="text-rice/70 mt-3 text-sm">
                  Satu alur dari meja ke dapur, tanpa membuat akun.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-2">
                  {['QR meja', 'Bayar', 'Antri'].map((step, index) => (
                    <div
                      key={step}
                      className="bg-rice/10 rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      <span className="text-rice/50 block text-[10px]">
                        0{index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="border-pine/10 bg-rice rounded-2xl border p-4">
                  <p className="text-pine/50 text-xs font-semibold tracking-[0.12em] uppercase">
                    Akses
                  </p>
                  <p className="font-display mt-2 text-xl font-bold">
                    Tanpa login
                  </p>
                </div>
                <div className="border-pine/10 bg-mint rounded-2xl border p-4">
                  <p className="text-pine/50 text-xs font-semibold tracking-[0.12em] uppercase">
                    Update
                  </p>
                  <p className="font-display mt-2 text-xl font-bold">
                    Realtime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-10 md:grid-cols-2">
          {entryPoints.map((entry) => {
            const Icon = entry.icon

            return (
              <Link
                key={entry.href}
                to={entry.href}
                className="group border-pine/10 hover:border-pine/20 focus-visible:ring-ring/50 rounded-3xl border bg-white/55 p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/80 focus-visible:ring-[3px] focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="bg-pine text-rice grid size-11 place-items-center rounded-2xl">
                    <Icon className="size-5" />
                  </span>
                  <ArrowUpRight className="text-pine/35 group-hover:text-chili size-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h2 className="font-display mt-5 text-xl font-bold tracking-tight">
                  {entry.title}
                </h2>
                <p className="text-pine/60 mt-2 text-sm leading-6">
                  {entry.description}
                </p>
                <span className="text-chili mt-4 inline-block text-sm font-semibold">
                  {entry.action}
                </span>
              </Link>
            )
          })}
        </section>
      </div>
    </main>
  )
}
