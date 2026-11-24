import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function OverviewDisplayCard() {
  return (
    <div className="border-pine/10 bg-pine text-rice rounded-2xl border p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold">Layar antrian</p>
          <p className="text-rice/60 mt-1 text-sm">
            Buka `/display` di TV atau monitor untuk menampilkan antrian publik.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="border-rice/20 text-rice hover:bg-rice/10 hover:text-rice"
          >
            <Link to="/display" target="_blank">
              Buka display
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
