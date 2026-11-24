import { create } from 'zustand'
import type { AuthSession, AuthUser } from './types'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous'

interface AuthState {
  status: AuthStatus
  accessToken: string | null
  user: AuthUser | null
  setSession: (session: AuthSession) => void
  setStatus: (status: AuthStatus) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  accessToken: null,
  user: null,
  setSession: (session) =>
    set({
      status: 'authenticated',
      accessToken: session.accessToken,
      user: session.user,
    }),
  setStatus: (status) => set({ status }),
  clearSession: () =>
    set({
      status: 'anonymous',
      accessToken: null,
      user: null,
    }),
}))
