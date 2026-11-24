import { MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import type { ModifierOption } from '../api/types'

interface ModifierOptionTableProps {
  options: ModifierOption[]
  onEditOption: (option: ModifierOption) => void
  onDeleteOption: (option: ModifierOption) => void
}

export function ModifierOptionTable({
  options,
  onEditOption,
  onDeleteOption,
}: ModifierOptionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Opsi</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {options.map((option) => (
          <TableRow key={option.id}>
            <TableCell>
              <span className="font-medium">{option.name}</span>
              {option.isDefault ? (
                <Badge variant="outline" className="ml-2">
                  Default
                </Badge>
              ) : null}
            </TableCell>
            <TableCell>
              {option.priceDelta > 0
                ? `+${formatCurrency(option.priceDelta)}`
                : 'Gratis'}
            </TableCell>
            <TableCell>
              <Badge variant={option.isActive ? 'secondary' : 'outline'}>
                {option.isActive ? 'Aktif' : 'Nonaktif'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Aksi ${option.name}`}
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditOption(option)}>
                    Ubah opsi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    disabled={!option.isActive}
                    onClick={() => onDeleteOption(option)}
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
  )
}
