import { BrandLockup } from '@/components/brand-lockup'

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between gap-6">
      <BrandLockup className="h-9" />
      <span className="border-pine/10 text-pine/70 rounded-full border bg-white/60 px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur">
        Sistem pesan restoran
      </span>
    </header>
  )
}
