import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ReportMetricProps {
  label: string
  value: string | number
  accent?: boolean
}

export function ReportMetric({
  label,
  value,
  accent = false,
}: ReportMetricProps) {
  return (
    <Card
      className={accent ? 'border-pine/15 bg-pine text-rice gap-2' : 'gap-2'}
    >
      <CardHeader>
        <CardDescription className={accent ? 'text-rice/60' : undefined}>
          {label}
        </CardDescription>
        <CardTitle className="font-display text-3xl font-bold tracking-[-0.04em]">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
