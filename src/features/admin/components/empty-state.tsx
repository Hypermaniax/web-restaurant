import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-border bg-card/60 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center">
      <span className="bg-mint text-pine grid size-12 place-items-center rounded-2xl">
        <Inbox className="size-6" />
      </span>
      <h2 className="font-display text-pine mt-4 text-xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
