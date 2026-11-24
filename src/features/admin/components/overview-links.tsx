import { ArrowUpRight, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface QuickLinkProps {
  to: string
  label: string
  icon?: 'external' | 'clipboard'
  primary?: boolean
}

function QuickLink({ to, label, icon = 'external', primary }: QuickLinkProps) {
  const Icon = icon === 'clipboard' ? ClipboardList : ArrowUpRight
  return (
    <Button
      asChild
      variant={primary ? 'default' : 'outline'}
      className={primary ? 'w-full justify-between' : 'justify-between'}
    >
      <Link to={to}>
        {label}
        <Icon />
      </Link>
    </Button>
  )
}

export function OverviewLinks() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="font-display text-xl font-bold">
            Katalog
          </CardTitle>
          <CardDescription>
            Kelola menu, modifier, dan ketersediaan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <QuickLink to="/admin/catalog/menu" label="Menu" />
          <QuickLink to="/admin/catalog/modifiers" label="Modifier" />
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="font-display text-xl font-bold">
            Restoran
          </CardTitle>
          <CardDescription>Meja, QR, dan akses staff.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <QuickLink to="/admin/tables" label="Meja & QR" />
          <QuickLink to="/admin/staff" label="Staff" />
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="font-display text-xl font-bold">
            Operasional
          </CardTitle>
          <CardDescription>
            Pantau order dan pembayaran berjalan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <QuickLink
            to="/admin/orders"
            label="Buka order monitor"
            icon="clipboard"
            primary
          />
          <QuickLink to="/admin/reports" label="Laporan" />
          <QuickLink to="/admin/settings" label="Pengaturan pajak" />
        </CardContent>
      </Card>
    </div>
  )
}
