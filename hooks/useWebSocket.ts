"use client"

import * as React from "react"

import type { ACPWebSocketMessage } from "@/types/acp"

const DEFAULT_RECONNECT_DELAY_MS = 3000

function normalizeIncomingMessage(payload: unknown): ACPWebSocketMessage {
  if (!payload || typeof payload !== "object") {
    return {
      type: "system",
      content: String(payload ?? ""),
      timestamp: new Date().toISOString(),
    } as ACPWebSocketMessage
  }

  const source = payload as Record<string, unknown>
  const type = typeof source.type === "string" ? source.type : "system"

  return {
    ...source,
    type,
    timestamp:
      typeof source.timestamp === "string"
        ? source.timestamp
        : new Date().toISOString(),
  } as ACPWebSocketMessage
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = React.useState(false)
  const [messages, setMessages] = React.useState<ACPWebSocketMessage[]>([])
  const [lastMessage, setLastMessage] = React.useState<ACPWebSocketMessage | null>(null)

  const socketRef = React.useRef<WebSocket | null>(null)
  const reconnectTimerRef = React.useRef<number | null>(null)
  const manuallyClosedRef = React.useRef(false)

  React.useEffect(() => {
    if (!url) {
      setIsConnected(false)
      return
    }

    manuallyClosedRef.current = false

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
    }

    const scheduleReconnect = () => {
      if (manuallyClosedRef.current) {
        return
      }

      clearReconnectTimer()
      reconnectTimerRef.current = window.setTimeout(() => {
        connect()
      }, DEFAULT_RECONNECT_DELAY_MS)
    }

    const connect = () => {
      clearReconnectTimer()

      try {
        const ws = new WebSocket(url)
        socketRef.current = ws

        ws.onopen = () => {
          setIsConnected(true)
        }

        ws.onmessage = (event) => {
          try {
            const parsed = normalizeIncomingMessage(JSON.parse(event.data))
            setLastMessage(parsed)
            setMessages((prev) => [...prev, parsed])
          } catch {
            const fallback = normalizeIncomingMessage({
              type: "system",
              content: String(event.data ?? ""),
            })
            setLastMessage(fallback)
            setMessages((prev) => [...prev, fallback])
          }
        }

        ws.onerror = () => {
          setIsConnected(false)
        }

        ws.onclose = () => {
          setIsConnected(false)
          socketRef.current = null
          scheduleReconnect()
        }
      } catch {
        setIsConnected(false)
        scheduleReconnect()
      }
    }

    connect()

    return () => {
      manuallyClosedRef.current = true
      clearReconnectTimer()
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [url])

  const sendMessage = React.useEffectEvent((message: string | Record<string, unknown>) => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false
    }

    socket.send(typeof message === "string" ? message : JSON.stringify(message))
    return true
  })

  return {
    isConnected,
    messages,
    sendMessage,
    lastMessage,
  }
}
