import {
  BarChart3,
  ClipboardList,
  Grid2X2,
  LayoutDashboard,
  Settings2,
  SlidersHorizontal,
  Tags,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import type { UserRole } from '@/lib/auth/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  roles: UserRole[]
  end?: boolean
}

export const navItems: NavItem[] = [
  {
    to: '/admin',
    label: 'Ringkasan',
    icon: LayoutDashboard,
    roles: ['ADMIN'],
    end: true,
  },
  {
    to: '/admin/orders',
    label: 'Order',
    icon: ClipboardList,
    roles: ['ADMIN', 'CASHIER'],
  },
  {
    to: '/admin/catalog/categories',
    label: 'Kategori',
    icon: Tags,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/catalog/menu',
    label: 'Menu',
    icon: UtensilsCrossed,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/catalog/modifiers',
    label: 'Modifier',
    icon: SlidersHorizontal,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/tables',
    label: 'Meja & QR',
    icon: Grid2X2,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/staff',
    label: 'Staff',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/reports',
    label: 'Laporan',
    icon: BarChart3,
    roles: ['ADMIN'],
  },
  {
    to: '/admin/settings',
    label: 'Pengaturan',
    icon: Settings2,
    roles: ['ADMIN'],
  },
]

export const roleLabel = {
  ADMIN: 'Admin',
  CASHIER: 'Kasir',
  KITCHEN: 'Kitchen',
}

export function getInitials(name: string | undefined): string {
  if (!name) return 'RB'
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
