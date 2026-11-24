import { MoreHorizontal, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ModifierGroup, ModifierOption } from '../api/types'
import { selectionTypeLabel } from '../lib/modifier-form'
import { ModifierOptionTable } from './modifier-option-table'

interface ModifierGroupCardProps {
  group: ModifierGroup
  onEditGroup: (group: ModifierGroup) => void
  onCreateOption: (group: ModifierGroup) => void
  onEditOption: (group: ModifierGroup, option: ModifierOption) => void
  onDeleteGroup: (group: ModifierGroup) => void
  onDeleteOption: (option: ModifierOption) => void
}

export function ModifierGroupCard({
  group,
  onEditGroup,
  onCreateOption,
  onEditOption,
  onDeleteGroup,
  onDeleteOption,
}: ModifierGroupCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="bg-muted/25 border-b px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-display text-xl font-bold">
                {group.name}
              </CardTitle>
              <Badge variant={group.isActive ? 'secondary' : 'outline'}>
                {group.isActive ? 'Aktif' : 'Nonaktif'}
              </Badge>
              {group.isRequired ? <Badge variant="outline">Wajib</Badge> : null}
            </div>
            <CardDescription className="mt-1">
              {selectionTypeLabel[group.selectionType]} · min {group.minSelect}
              {group.maxSelect !== null ? ` / maks ${group.maxSelect}` : ''}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Aksi ${group.name}`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditGroup(group)}>
                Ubah grup
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateOption(group)}>
                Tambah opsi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                disabled={!group.isActive}
                onClick={() => onDeleteGroup(group)}
              >
                Nonaktifkan grup
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {group.options.length > 0 ? (
          <ModifierOptionTable
            options={group.options}
            onEditOption={(option) => onEditOption(group, option)}
            onDeleteOption={onDeleteOption}
          />
        ) : (
          <div className="text-muted-foreground px-5 py-8 text-center text-sm">
            Belum ada opsi di grup ini.
          </div>
        )}
        <div className="border-t px-5 py-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCreateOption(group)}
          >
            <Plus />
            Tambah opsi
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
