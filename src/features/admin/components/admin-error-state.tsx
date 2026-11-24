import { Button } from '@/components/ui/button'

interface AdminErrorStateProps {
  title: string
  message: string
  onRetry: () => void
}

export function AdminErrorState({
  title,
  message,
  onRetry,
}: AdminErrorStateProps) {
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
