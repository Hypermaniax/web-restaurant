import { LandingEntryPoints } from '../components/landing-entry-points'
import { LandingHeader } from '../components/landing-header'
import { LandingHero } from '../components/landing-hero'

export function LandingPage() {
  return (
    <main className="bg-rice text-pine relative min-h-svh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(242,169,59,0.2),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(220,232,223,0.8),transparent_32%),linear-gradient(135deg,rgba(255,253,248,0.7),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-svh w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <LandingHeader />
        <LandingHero />
        <LandingEntryPoints />
      </div>
    </main>
  )
}
