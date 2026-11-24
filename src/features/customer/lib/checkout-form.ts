import { z } from 'zod'

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .max(80, 'Nama maksimal 80 karakter.')
    .optional()
    .or(z.literal('')),
  customerEmail: z
    .string()
    .trim()
    .max(254, 'Email maksimal 254 karakter.')
    .email('Format email belum benar.')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(500, 'Catatan maksimal 500 karakter.')
    .optional()
    .or(z.literal('')),
  paymentMethod: z.enum(['QRIS', 'CASH']),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
