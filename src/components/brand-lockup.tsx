import { cn } from '@/lib/utils'

interface BrandLockupProps {
  className?: string
  variant?: 'light' | 'dark'
}

export function BrandLockup({
  className,
  variant = 'light',
}: BrandLockupProps) {
  return (
    <img
      src={
        variant === 'dark'
          ? '/brand/logo-lockup-dark.svg'
          : '/brand/logo-lockup.svg'
      }
      alt="Rembuk"
      className={cn('h-8 w-auto', className)}
    />
  )
}
