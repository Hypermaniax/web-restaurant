import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '@/lib/env'
import { useAuthStore } from '@/lib/auth/auth-store'
import { adminKeys } from '../api/admin-api'

const cashierEvents = [
  'order.created',
  'order.paid',
  'order.status_changed',
  'order.cancelled',
]

export function useCashierRealtime() {
  const token = useAuthStore((state) => state.accessToken)
  const queryClient = useQueryClient()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!token) return

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    })

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.orders })
      void queryClient.invalidateQueries({ queryKey: adminKeys.dashboard })
    }

    socket.on('connect', () => {
      setConnected(true)
      refresh()
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', () => setConnected(false))
    cashierEvents.forEach((event) => socket.on(event, refresh))

    return () => {
      cashierEvents.forEach((event) => socket.off(event, refresh))
      socket.disconnect()
      setConnected(false)
    }
  }, [queryClient, token])

  return connected
}
