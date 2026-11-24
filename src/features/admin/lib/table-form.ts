import { z } from 'zod'
import type { TableInput } from '../api/admin-api'
import type { Table } from '../api/types'

export const tableSchema = z.object({
  code: z
    .string()
    .min(1, 'Kode wajib diisi')
    .regex(
      /^[A-Z0-9][A-Z0-9-]{0,19}$/,
      'Gunakan huruf, angka, atau tanda hubung (maks. 20)',
    ),
  name: z.string().min(1, 'Nama wajib diisi').max(80, 'Maksimal 80 karakter'),
  zone: z.string().max(50, 'Maksimal 50 karakter'),
  isActive: z.boolean(),
})

export type TableValues = z.infer<typeof tableSchema>

export const emptyTableValues: TableValues = {
  code: '',
  name: '',
  zone: '',
  isActive: true,
}

export function toTableValues(table: Table): TableValues {
  return {
    code: table.code,
    name: table.name,
    zone: table.zone ?? '',
    isActive: table.isActive,
  }
}

export function toTableInput(values: TableValues): TableInput {
  return {
    ...values,
    code: values.code.trim().toUpperCase(),
    zone: values.zone.trim() || null,
  }
}

export function isLocalQrUrl(url: string | undefined): boolean {
  if (!url) return false
  return /localhost|127\.0\.0\.1/i.test(url) || url.startsWith('http://')
}
