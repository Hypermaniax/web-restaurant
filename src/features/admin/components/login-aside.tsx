import { BrandLockup } from '@/components/brand-lockup'

export function LoginAside() {
  return (
    <section className="bg-pine text-rice relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(242,169,59,0.22),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(220,232,223,0.12),transparent_35%)]" />
      <div className="relative">
        <BrandLockup variant="dark" className="h-10" />
        <p className="font-display mt-16 max-w-md text-5xl leading-[0.95] font-bold tracking-[-0.05em] xl:text-6xl">
          Satu meja kerja untuk seluruh restoran.
        </p>
        <p className="text-rice/65 mt-6 max-w-md text-base leading-7">
          Kelola menu, meja, QR, staff, dan pengaturan Rembuk dari satu
          back-office yang tenang dan jelas.
        </p>
      </div>
      <div className="text-rice/45 relative flex items-center gap-3 text-sm">
        <span className="bg-marigold size-2 rounded-full" />
        Akses staff · ADMIN & CASHIER
      </div>
    </section>
  )
}
