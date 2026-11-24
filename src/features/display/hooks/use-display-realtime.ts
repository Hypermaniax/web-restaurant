import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '@/lib/env'
import { displayKeys, type DisplayQueueView } from '../api/display-api'
import { mergeQueueUpdate, toQueueItem } from '../lib/queue'

export function useDisplayRealtime() {
  const queryClient = useQueryClient()
  const [connected, setConnected] = useState(false)
  const [lastEventAt, setLastEventAt] = useState<number | null>(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { channel: 'display' },
      transports: ['websocket'],
    })

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: displayKeys.queue })
    }

    const handleConnect = () => {
      setConnected(true)
      setLastEventAt(Date.now())
      refresh()
    }

    const handleDisconnect = () => {
      setConnected(false)
    }

    const handleQueueUpdated = (payload: unknown) => {
      const record =
        typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>)
          : null
      const item = toQueueItem(record?.queue)

      if (!item) {
        return
      }

      queryClient.setQueryData<DisplayQueueView>(
        displayKeys.queue,
        (current) => (current ? mergeQueueUpdate(current, item) : current),
      )
      setLastEventAt(Date.now())
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleDisconnect)
    socket.on('queue.updated', handleQueueUpdated)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleDisconnect)
      socket.off('queue.updated', handleQueueUpdated)
      socket.disconnect()
      setConnected(false)
    }
  }, [queryClient])

  return { connected, lastEventAt }
}
