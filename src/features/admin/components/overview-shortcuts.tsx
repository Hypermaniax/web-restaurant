import { ClipboardList, Grid2X2, UtensilsCrossed } from 'lucide-react'

const shortcuts = [
  { label: 'Menu', icon: UtensilsCrossed },
  { label: 'Meja', icon: Grid2X2 },
  { label: 'Order', icon: ClipboardList },
]

export function OverviewShortcuts() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {shortcuts.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="border-pine/10 bg-card flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium"
          >
            <span className="bg-mint text-pine grid size-9 place-items-center rounded-xl">
              <Icon className="size-4" />
            </span>
            {item.label}
          </div>
        )
      })}
    </div>
  )
}
