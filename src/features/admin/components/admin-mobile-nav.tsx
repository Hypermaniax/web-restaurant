import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AuthUser } from '@/lib/auth/types'
import { cn } from '@/lib/utils'
import { roleLabel, type NavItem } from '../lib/admin-nav'

interface AdminMobileNavProps {
  user: AuthUser | null
  items: NavItem[]
  onLogout: () => void
}

export function AdminMobileNav({ user, items, onLogout }: AdminMobileNavProps) {
  return (
    <>
      <header className="border-pine/10 bg-rice/90 sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 backdrop-blur sm:px-6 lg:hidden">
        <BrandLockup className="h-8" />
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{user ? roleLabel[user.role] : '-'}</Badge>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Keluar"
            onClick={onLogout}
          >
            <LogOut />
          </Button>
        </div>
      </header>

      <nav className="border-pine/10 bg-rice/90 sticky top-16 z-20 flex gap-1 overflow-x-auto border-b px-3 py-2 backdrop-blur lg:hidden">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-pine text-rice'
                    : 'text-pine/60 hover:bg-pine/5 hover:text-pine',
                )
              }
            >
              <Icon className="size-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
