import { ArrowUpRight, LayoutDashboard, Monitor } from 'lucide-react'
import { Link } from 'react-router-dom'

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

export function LandingEntryPoints() {
  return (
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
  )
}
