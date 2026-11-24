import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UserRole } from '@/lib/auth/types'
import type { CreateValues } from '../lib/staff-form'

interface StaffCreateFieldsProps {
  form: UseFormReturn<CreateValues>
}

export function StaffCreateFields({ form }: StaffCreateFieldsProps) {
  const selectedRole = useWatch({ control: form.control, name: 'role' })

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="staff-name">Nama</Label>
        <Input
          id="staff-name"
          placeholder="Kasir Rembuk"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="staff-email">Email</Label>
        <Input
          id="staff-email"
          type="email"
          placeholder="kasir@rembuk.local"
          {...form.register('email')}
        />
        {form.formState.errors.email ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="staff-password">Password awal</Label>
        <Input
          id="staff-password"
          type="password"
          autoComplete="new-password"
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Role</Label>
        <Select
          value={selectedRole}
          onValueChange={(value) => form.setValue('role', value as UserRole)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="CASHIER">Kasir</SelectItem>
              <SelectItem value="KITCHEN">Kitchen</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
