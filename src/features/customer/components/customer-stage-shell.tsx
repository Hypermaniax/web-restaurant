import type { ReactNode } from 'react'
import { CustomerTopBar } from './customer-top-bar'

interface CustomerStageShellProps {
  tableName: string
  cartCount: number
  children: ReactNode
}

export function CustomerStageShell({
  tableName,
  cartCount,
  children,
}: CustomerStageShellProps) {
  return (
    <div className="bg-rice text-pine min-h-svh">
      <CustomerTopBar
        tableName={tableName}
        cartCount={cartCount}
        showCart={false}
      />
      {children}
    </div>
  )
}
