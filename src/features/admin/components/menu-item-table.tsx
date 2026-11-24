import { ImagePlus, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { assetUrl } from '@/lib/assets'
import { formatCurrency } from '@/lib/format'
import type { MenuItem } from '../api/types'

interface MenuItemTableProps {
  items: MenuItem[]
  availabilityPending: boolean
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onAvailabilityChange: (item: MenuItem, isAvailable: boolean) => void
}

export function MenuItemTable({
  items,
  availabilityPending,
  onEdit,
  onDelete,
  onAvailabilityChange,
}: MenuItemTableProps) {
  return (
    <div className="border-pine/10 bg-card overflow-hidden rounded-2xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Menu</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Tersedia</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-muted grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl">
                    {item.imageUrl ? (
                      <img
                        src={assetUrl(item.imageUrl) ?? ''}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="text-muted-foreground size-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {item.modifierGroups.length > 0
                        ? `${item.modifierGroups.length} modifier`
                        : 'Tanpa modifier'}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.categoryName}
              </TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>
                <Switch
                  checked={item.isAvailable}
                  aria-label={`Ketersediaan ${item.name}`}
                  disabled={availabilityPending}
                  onCheckedChange={(checked) =>
                    onAvailabilityChange(item, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <Badge variant={item.isActive ? 'secondary' : 'outline'}>
                  {item.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Aksi ${item.name}`}
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      Ubah menu
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      disabled={!item.isActive}
                      onClick={() => onDelete(item)}
                    >
                      Nonaktifkan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
