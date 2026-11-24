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
import { formatDateTime } from '@/lib/format'
import type { Staff } from '../api/types'
import { roleLabels } from '../lib/staff-form'

interface StaffTableProps {
  staff: Staff[]
  currentUserId: string | undefined
  onResetPassword: (staff: Staff) => void
  onDeactivate: (staff: Staff) => void
}

export function StaffTable({
  staff,
  currentUserId,
  onResetPassword,
  onDeactivate,
}: StaffTableProps) {
  return (
    <div className="border-pine/10 bg-card overflow-hidden rounded-2xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Login terakhir</TableHead>
            <TableHead className="w-16 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {member.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{roleLabels[member.role]}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={member.isActive ? 'secondary' : 'outline'}>
                  {member.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {member.lastLoginAt
                  ? formatDateTime(member.lastLoginAt)
                  : 'Belum pernah'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Aksi ${member.name}`}
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onResetPassword(member)}>
                      Reset password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      disabled={!member.isActive || member.id === currentUserId}
                      onClick={() => onDeactivate(member)}
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
