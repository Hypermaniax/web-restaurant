import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { DashboardSummary } from '../api/types'

const stats = [
  { key: 'revenueToday', label: 'Omzet hari ini', kind: 'currency' },
  { key: 'openTables', label: 'Meja terbuka', kind: 'number' },
  { key: 'pendingPayments', label: 'Pembayaran tertunda', kind: 'number' },
  { key: 'kdsQueue', label: 'Antrian dapur', kind: 'number' },
] as const

interface OverviewStatsProps {
  data: DashboardSummary
}

export function OverviewStats({ data }: OverviewStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const value = data[stat.key]
        return (
          <Card key={stat.key} className="gap-2 py-5">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="font-display text-3xl font-bold tracking-[-0.04em]">
                {stat.kind === 'currency' ? formatCurrency(value) : value}
              </CardTitle>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
