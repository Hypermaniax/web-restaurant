import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AuthUser } from '@/lib/auth/types'
import { cn } from '@/lib/utils'
import { getInitials, roleLabel, type NavItem } from '../lib/admin-nav'

interface AdminSidebarProps {
  user: AuthUser | null
  items: NavItem[]
  onLogout: () => void
}

export function AdminSidebar({ user, items, onLogout }: AdminSidebarProps) {
  return (
    <aside className="border-pine/10 bg-pine text-rice fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r lg:flex">
      <div className="flex h-20 items-center px-6">
        <BrandLockup variant="dark" className="h-9" />
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="text-rice/35 px-3 pb-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
          Workspace
        </p>
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-rice/12 text-rice shadow-sm'
                      : 'text-rice/60 hover:bg-rice/8 hover:text-rice',
                  )
                }
              >
                <Icon className="size-4.5" />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <div className="border-rice/10 border-t p-3">
        <div className="bg-rice/6 rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <span className="bg-marigold text-pine grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold">
              {getInitials(user?.name)}
            </span>
            <div className="min-w-0">
              <p className="text-rice truncate text-sm font-semibold">
                {user?.name ?? 'Staff Rembuk'}
              </p>
              <p className="text-rice/45 truncate text-xs">
                {user?.email ?? '-'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="bg-rice/10 text-rice border-0"
            >
              {user ? roleLabel[user.role] : '-'}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="text-rice/60 hover:bg-rice/10 hover:text-rice"
              onClick={onLogout}
            >
              <LogOut />
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
