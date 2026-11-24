import { ShoppingBag, Table2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLockup } from '@/components/brand-lockup'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CustomerTopBarProps {
  tableName?: string
  cartCount: number
  showCart: boolean
  onOpenCart?: () => void
}

export function CustomerTopBar({
  tableName,
  cartCount,
  showCart,
  onOpenCart,
}: CustomerTopBarProps) {
  return (
    <header className="border-pine/10 bg-rice/90 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link to="/" aria-label="Rembuk" className="shrink-0">
          <BrandLockup className="h-7" />
        </Link>

        <div className="flex items-center gap-2">
          {tableName ? (
            <Badge variant="secondary" className="gap-1.5">
              <Table2 className="size-3.5" />
              {tableName}
            </Badge>
          ) : null}
          {showCart ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="relative"
              onClick={onOpenCart}
              aria-label={`Buka pesanan, ${cartCount} item`}
            >
              <ShoppingBag data-icon="inline-start" />
              Pesanan
              {cartCount > 0 ? (
                <span className="bg-pine text-rice absolute -top-2 -right-2 grid size-5 place-items-center rounded-full text-[10px] font-bold tabular-nums">
                  {cartCount}
                </span>
              ) : null}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
