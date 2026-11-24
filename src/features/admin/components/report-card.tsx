import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '../lib/errors'

interface ReportErrorCardProps {
  title: string
  message: string
  onRetry: () => void
}

export function ReportErrorCard({
  title,
  message,
  onRetry,
}: ReportErrorCardProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6">
      <p className="text-destructive font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{message}</p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
  )
}

interface ReportCardProps {
  title: string
  description: string
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  children: ReactNode
}

export function ReportCard({
  title,
  description,
  isLoading,
  isError,
  error,
  onRetry,
  children,
}: ReportCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ReportErrorCard
            title="Laporan gagal dimuat"
            message={getErrorMessage(error)}
            onRetry={onRetry}
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
