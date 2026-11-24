import { Home, Table2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomerTopBar } from './customer-top-bar'

export function MenuLoading() {
  return (
    <div className="bg-rice text-pine min-h-svh">
      <CustomerTopBar cartCount={0} showCart={false} />
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-6 h-14 w-2/3 max-w-md" />
        <Skeleton className="mt-3 h-5 w-1/2 max-w-sm" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

interface TableErrorProps {
  message: string
}

export function TableError({ message }: TableErrorProps) {
  return (
    <div className="bg-rice text-pine min-h-svh">
      <CustomerTopBar cartCount={0} showCart={false} />
      <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8">
        <Empty className="border-pine/10 bg-card border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Table2 />
            </EmptyMedia>
            <EmptyTitle>Meja tidak bisa dibuka</EmptyTitle>
            <EmptyDescription>{message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="accent">
              <Link to="/">
                <Home data-icon="inline-start" />
                Kembali ke beranda
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
