export type UserRole = 'ADMIN' | 'CASHIER' | 'KITCHEN'

export interface AuthUser {
  id: string
  outletId: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

export interface AuthSession {
  accessToken: string
  refreshToken?: string
  user: AuthUser
  message?: string
}
