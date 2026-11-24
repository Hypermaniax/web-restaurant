import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { PageMeta } from '../api/types'

interface PaginationProps {
  meta: PageMeta
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

function getPageItems(
  page: number,
  totalPages: number,
): Array<number | string> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right)
  const items: Array<number | string> = []

  for (const value of pages) {
    const previous = items.at(-1)
    if (typeof previous === 'number' && value - previous > 1) {
      items.push(`ellipsis-${previous}`)
    }
    items.push(value)
  }

  return items
}

export function Pagination({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: PaginationProps) {
  useEffect(() => {
    if (meta.totalPages > 0 && meta.page > meta.totalPages) {
      onPageChange(meta.totalPages)
    }
  }, [meta.page, meta.totalPages, onPageChange])

  if (meta.total === 0) {
    return null
  }

  const start = Math.min((meta.page - 1) * meta.pageSize + 1, meta.total)
  const end = Math.min(meta.page * meta.pageSize, meta.total)
  const pages = getPageItems(meta.page, meta.totalPages)

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted-foreground text-sm">
        Menampilkan {start}–{end} dari {meta.total}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        {onPageSizeChange ? (
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Per halaman</span>
            <select
              aria-label="Baris per halaman"
              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 rounded-md border px-2 text-sm outline-none focus-visible:ring-[3px]"
              value={meta.pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Halaman sebelumnya"
            disabled={meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
          >
            <ChevronLeft />
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            {pages.map((item) =>
              typeof item === 'number' ? (
                <Button
                  key={item}
                  type="button"
                  variant={item === meta.page ? 'default' : 'outline'}
                  size="sm"
                  className="min-w-8 px-2"
                  aria-label={`Halaman ${item}`}
                  aria-current={item === meta.page ? 'page' : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </Button>
              ) : (
                <span
                  key={item}
                  aria-hidden="true"
                  className="text-muted-foreground px-1 text-sm"
                >
                  …
                </span>
              ),
            )}
          </div>

          <span className="text-muted-foreground text-sm sm:hidden">
            Halaman {meta.page} / {meta.totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Halaman berikutnya"
            disabled={meta.page >= meta.totalPages}
            onClick={() => onPageChange(meta.page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </nav>
  )
}
