import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type {
  OrderFilters,
  OrderSource,
  OrderStatus,
  OrderType,
} from '../api/orders-api'
import {
  orderSourceOptions,
  orderStatusOptions,
  orderTypeOptions,
  setOrderFilter,
} from '../lib/order-filters'
import { FilterField, FilterSelect } from './filter-field'

interface OrderFilterCardProps {
  filters: OrderFilters
  tables: Array<{ id: string; code: string; name: string }>
  hasFilters: boolean
  onFiltersChange: (filters: OrderFilters) => void
  onReset: () => void
}

export function OrderFilterCard({
  filters,
  tables,
  hasFilters,
  onFiltersChange,
  onReset,
}: OrderFilterCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold">Filter</CardTitle>
        <CardDescription>
          Persempit daftar berdasarkan status, tipe, sumber, meja, atau tanggal
          bisnis.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <FilterSelect
          id="filter-status"
          label="Status"
          value={filters.status ?? 'all'}
          allLabel="Semua status"
          options={orderStatusOptions}
          onChange={(value) =>
            onFiltersChange(
              setOrderFilter(filters, 'status', value as OrderStatus | 'all'),
            )
          }
        />
        <FilterSelect
          id="filter-type"
          label="Tipe order"
          value={filters.orderType ?? 'all'}
          allLabel="Semua tipe"
          options={orderTypeOptions}
          onChange={(value) =>
            onFiltersChange(
              setOrderFilter(filters, 'orderType', value as OrderType | 'all'),
            )
          }
        />
        <FilterSelect
          id="filter-source"
          label="Sumber"
          value={filters.source ?? 'all'}
          allLabel="Semua sumber"
          options={orderSourceOptions}
          onChange={(value) =>
            onFiltersChange(
              setOrderFilter(filters, 'source', value as OrderSource | 'all'),
            )
          }
        />
        <FilterSelect
          id="filter-table"
          label="Meja"
          value={filters.tableId ?? 'all'}
          allLabel="Semua meja"
          options={tables.map((table) => ({
            value: table.id,
            label: `${table.code} · ${table.name}`,
          }))}
          onChange={(value) =>
            onFiltersChange(setOrderFilter(filters, 'tableId', value))
          }
        />
        <FilterField label="Tanggal bisnis" htmlFor="filter-date">
          <Input
            id="filter-date"
            type="date"
            value={filters.date ?? ''}
            onChange={(event) =>
              onFiltersChange(
                setOrderFilter(filters, 'date', event.target.value),
              )
            }
          />
        </FilterField>
        <FilterField label="Nomor order" htmlFor="filter-number">
          <div className="flex gap-2">
            <Input
              id="filter-number"
              value={filters.orderNumber ?? ''}
              placeholder="20261122-"
              onChange={(event) =>
                onFiltersChange(
                  setOrderFilter(filters, 'orderNumber', event.target.value),
                )
              }
            />
            {hasFilters ? (
              <Button
                size="icon"
                variant="outline"
                aria-label="Hapus filter"
                onClick={onReset}
              >
                <X />
              </Button>
            ) : null}
          </div>
        </FilterField>
      </CardContent>
    </Card>
  )
}
