import { z } from 'zod'
import type { UserRole } from '@/lib/auth/types'

export const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Admin',
  CASHIER: 'Kasir',
  KITCHEN: 'Kitchen',
}

export const createSchema = z.object({
  name: z.string().min(2, 'Minimal 2 karakter').max(100, 'Maksimal 100'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Minimal 8 karakter').max(72, 'Maksimal 72'),
  role: z.enum(['ADMIN', 'CASHIER', 'KITCHEN']),
})

export const passwordSchema = z.object({
  password: z.string().min(8, 'Minimal 8 karakter').max(72, 'Maksimal 72'),
})

export type CreateValues = z.infer<typeof createSchema>
export type PasswordValues = z.infer<typeof passwordSchema>

export const emptyCreate: CreateValues = {
  name: '',
  email: '',
  password: '',
  role: 'CASHIER',
}
