import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'

/* Chat WebSocket — one connection per logged-in user */
export function useChatWS(onMessage) {
  const token = useAuthStore((s) => s.token)
  const wsRef = useRef(null)

  useEffect(() => {
    if (!token) return
    const ws = new WebSocket(`ws://localhost:8085/ws/chat?token=${token}`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      try { onMessage && onMessage(JSON.parse(e.data)) } catch (_) {}
    }
    ws.onerror = () => {}

    return () => ws.readyState === WebSocket.OPEN && ws.close()
  }, [token]) // eslint-disable-line

  return wsRef
}

/* Analytics WebSocket — per-site real-time counts */
export function useAnalyticsWS(siteId, onUpdate) {
  const wsRef = useRef(null)

  useEffect(() => {
    if (!siteId) return
    const ws = new WebSocket(`ws://localhost:8086/ws/analytics/${siteId}`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      try { onUpdate && onUpdate(JSON.parse(e.data)) } catch (_) {}
    }
    ws.onerror = () => {}

    return () => ws.readyState === WebSocket.OPEN && ws.close()
  }, [siteId]) // eslint-disable-line

  return wsRef
}