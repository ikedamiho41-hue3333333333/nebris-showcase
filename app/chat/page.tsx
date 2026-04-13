"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Send,
  Zap,
  Star,
  Sparkles,
  Loader2,
  Settings,
  ChevronDown,
} from "lucide-react"

const modes = [
  {
    id: "quick",
    name: "Quick",
    nameCn: "快速",
    price: "$0.008",
    icon: Zap,
    color: "#5EEAD4",
    models: 5,
    rounds: 1,
  },
  {
    id: "standard",
    name: "Standard",
    nameCn: "标准",
    price: "$0.065",
    icon: Star,
    color: "#C9A84C",
    models: 18,
    rounds: 4,
  },
  {
    id: "deep",
    name: "Deep",
    nameCn: "深度",
    price: "$0.174",
    icon: Sparkles,
    color: "#818CF8",
    models: 27,
    rounds: 8,
  },
] as const

type ModeId = (typeof modes)[number]["id"]

/** 与 nebris-engine acp-ws-server / web-gateway 下行协议对齐 */
type WsInbound =
  | { type: "hello"; message?: string; port?: number }
  | { type: "pong" }
  | { type: "status"; connected?: boolean; sessionId?: string; mode?: string; modelCount?: number }
  | {
      type: "ai"
      modelId?: string
      label?: string
      color?: string
      role?: string | null
      content?: string
      thinking?: string
    }
  | {
      type: "vote"
      title?: string
      items?: { label: string; value?: number; percent: number }[]
    }
  | { type: "consensus"; title?: string; text?: string }
  | { type: "done"; sessionId?: string }
  | { type: "error"; message?: string }

export type ChatMessage =
  | { id: string; type: "user"; content: string; timestamp: Date }
  | { id: string; type: "system"; content: string; timestamp: Date }
  | {
      id: string
      type: "ai"
      content: string
      thinking?: string
      label: string
      role?: string
      color: string
      staggerIndex: number
      timestamp: Date
    }
  | {
      id: string
      type: "vote"
      title: string
      items: { label: string; value?: number; percent: number }[]
      timestamp: Date
    }
  | { id: string; type: "consensus"; title: string; text: string; timestamp: Date }

const WS_DEFAULT = "ws://localhost:3001"
const RECONNECT_MS = 3000

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function ChatPage() {
  const [selectedMode, setSelectedMode] = useState<(typeof modes)[number]>(modes[1])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "system",
      content:
        "欢迎使用 NEBRIS。连接 ws://localhost:3001 后发送话题，将与 nebris-engine ACP 网关协议一致（discuss / ai / vote / consensus / done）。",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isDiscussing, setIsDiscussing] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [remoteModelCount, setRemoteModelCount] = useState<number | null>(null)
  const [aiStaggerCounter, setAiStaggerCounter] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const destroyedRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleWsMessage = useCallback((raw: string) => {
    let data: WsInbound
    try {
      data = JSON.parse(raw) as WsInbound
    } catch {
      return
    }

    if (data.type === "hello" || data.type === "pong") {
      return
    }

    if (data.type === "status") {
      if (data.sessionId) setSessionId(data.sessionId)
      if (typeof data.modelCount === "number") setRemoteModelCount(data.modelCount)
      return
    }

    if (data.type === "ai") {
      const color = data.color || "#C9A84C"
      const label = data.label || data.modelId || "AI"
      const content = data.content || ""
      const thinking = typeof data.thinking === "string" && data.thinking.trim() ? data.thinking : undefined

      setAiStaggerCounter((c) => {
        const staggerIndex = c
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            type: "ai",
            content,
            thinking,
            label,
            role: data.role || undefined,
            color,
            staggerIndex,
            timestamp: new Date(),
          },
        ])
        return c + 1
      })
      return
    }

    if (data.type === "vote") {
      const title = data.title || "投票"
      const items = Array.isArray(data.items) ? data.items : []
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          type: "vote",
          title,
          items: items.map((it) => ({
            label: String(it.label ?? ""),
            value: it.value,
            percent: Math.max(0, Math.min(100, Number(it.percent) || 0)),
          })),
          timestamp: new Date(),
        },
      ])
      return
    }

    if (data.type === "consensus") {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          type: "consensus",
          title: data.title || "共识",
          text: data.text || "",
          timestamp: new Date(),
        },
      ])
      return
    }

    if (data.type === "done") {
      setIsDiscussing(false)
      if (data.sessionId) setSessionId(data.sessionId)
      return
    }

    if (data.type === "error") {
      setIsDiscussing(false)
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          type: "system",
          content: `错误：${data.message || "未知"}`,
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  const connectWs = useCallback(() => {
    if (destroyedRef.current) return

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }

    try {
      wsRef.current?.close()
    } catch {
      /* ignore */
    }
    wsRef.current = null

    const url =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_NEBRIS_WS_URL || WS_DEFAULT
        : WS_DEFAULT

    let ws: WebSocket
    try {
      ws = new WebSocket(url)
    } catch {
      setIsConnected(false)
      reconnectTimerRef.current = setTimeout(connectWs, RECONNECT_MS)
      return
    }

    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
    }

    ws.onclose = () => {
      wsRef.current = null
      setIsConnected(false)
      if (!destroyedRef.current) {
        reconnectTimerRef.current = setTimeout(connectWs, RECONNECT_MS)
      }
    }

    ws.onerror = () => {
      /* onclose 会处理重连 */
    }

    ws.onmessage = (ev) => {
      handleWsMessage(String(ev.data))
    }
  }, [handleWsMessage])

  useEffect(() => {
    destroyedRef.current = false
    connectWs()
    return () => {
      destroyedRef.current = true
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      try {
        wsRef.current?.close()
      } catch {
        /* ignore */
      }
      wsRef.current = null
    }
  }, [connectWs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isDiscussing) return

    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          type: "system",
          content: "未连接 WebSocket，请启动 nebris-engine（acp-ws-server 或 app.js 网关）监听 3001。",
          timestamp: new Date(),
        },
      ])
      return
    }

    setMessages((prev) => [
      ...prev,
      { id: newId(), type: "user", content: text, timestamp: new Date() },
    ])
    setInput("")
    setAiStaggerCounter(0)
    setIsDiscussing(true)
    setRemoteModelCount(null)

    const mode = selectedMode.id as ModeId
    const payload = { action: "discuss" as const, text, mode }
    ws.send(JSON.stringify(payload))
  }

  const displayModels = remoteModelCount ?? selectedMode.models

  return (
    <div className="flex h-screen bg-[#0A0A0F]">
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#2A2A36] bg-[#0A0A0F] px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-[#EEF2EA]">AI 协作创作</h1>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-[#9BA89F]">
                <span
                  className="inline-flex items-center gap-1.5"
                  title={isConnected ? "WebSocket 已连接" : "WebSocket 未连接，3s 后重试"}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: isConnected ? "#29bf69" : "#c0392b",
                      boxShadow: isConnected
                        ? "0 0 8px rgba(41,191,105,0.55)"
                        : "0 0 8px rgba(192,57,43,0.45)",
                    }}
                  />
                  {isConnected ? "已连接" : "断开 · 自动重连"}
                </span>
                {sessionId ? <span className="text-[#6b7280]">· {sessionId.slice(0, 20)}…</span> : null}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-[#9BA89F] transition-colors hover:bg-[#1A1A24] hover:text-[#EEF2EA]"
            aria-label="设置"
          >
            <Settings className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "user" ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#C9A84C] px-4 py-3">
                      <p className="text-sm text-[#0A0A0F]">{message.content}</p>
                    </div>
                  </div>
                ) : message.type === "ai" ? (
                  <div
                    className="animate-in fade-in slide-in-from-bottom-2 flex gap-0 duration-500"
                    style={{
                      animationDelay: `${message.staggerIndex * 120}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <div
                      className="w-1 shrink-0 rounded-l-xl"
                      style={{
                        backgroundColor: message.color,
                        boxShadow: `0 0 12px color-mix(in srgb, ${message.color} 55%, transparent)`,
                      }}
                      aria-hidden
                    />
                    <div className="max-w-[min(92%,560px)] flex-1 overflow-hidden rounded-r-xl rounded-tl-xl border border-l-0 border-[#2A2A36] bg-[#12121A]">
                      <div className="flex flex-wrap items-baseline gap-2 border-b border-white/[0.06] bg-white/[0.04] px-3 py-2">
                        <span className="text-sm font-semibold" style={{ color: message.color }}>
                          {message.label}
                        </span>
                        {message.role ? (
                          <span className="text-[10px] uppercase tracking-wider text-[#9BA89F]">
                            {message.role}
                          </span>
                        ) : null}
                      </div>
                      {message.thinking ? (
                        <details className="group border-b border-white/[0.06] bg-[#e8eaef]">
                          <summary className="flex cursor-pointer list-none items-center gap-1 px-3 py-2 text-[11px] tracking-wide text-[#5c6370] [&::-webkit-details-marker]:hidden">
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180" />
                            思考过程
                          </summary>
                          <div className="px-3 pb-2 text-xs leading-relaxed whitespace-pre-wrap text-[#4b5563]">
                            {message.thinking}
                          </div>
                        </details>
                      ) : null}
                      <div className="bg-white px-3 py-3 text-sm leading-relaxed whitespace-pre-wrap text-[#111827]">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ) : message.type === "vote" ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-xl border border-[#C9A84C]/25 bg-[#12121A] p-4">
                    <h4 className="mb-3 text-xs font-medium tracking-wider text-[#C9A84C]">
                      {message.title}
                    </h4>
                    <div className="space-y-2">
                      {message.items.map((it, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-sm">
                          <span className="text-[#EEF2EA]">{it.label}</span>
                          <span className="text-right tabular-nums text-[#C9A84C]/80">{it.percent}%</span>
                          <div className="col-span-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#C9A84C]/40 to-[#e4c76a]"
                              style={{ width: `${it.percent}%`, transition: "width 0.65s ease" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : message.type === "consensus" ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-xl border-2 border-[#C9A84C]/45 bg-gradient-to-br from-[#282212]/90 to-[#12121A] p-4 shadow-[0_0_24px_rgba(201,168,76,0.12)]">
                    <h4 className="mb-2 text-xs font-medium tracking-widest text-[#C9A84C]">
                      {message.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-[#e8e3d4] whitespace-pre-wrap">{message.text}</p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="max-w-[90%] rounded-xl bg-[#12121A] px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm text-[#9BA89F]">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isDiscussing && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-[#C9A84C]" />
                <span className="text-sm text-[#9BA89F]">ACP 讨论进行中…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-[#2A2A36] bg-[#0A0A0F] p-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => !isDiscussing && setSelectedMode(mode)}
                  disabled={isDiscussing}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                    selectedMode.id === mode.id
                      ? "border border-transparent bg-opacity-20"
                      : "border border-[#2A2A36] bg-[#12121A] text-[#9BA89F] hover:border-[#3A3A46]"
                  } ${isDiscussing ? "cursor-not-allowed opacity-60" : ""}`}
                  style={
                    selectedMode.id === mode.id
                      ? { backgroundColor: `${mode.color}20`, color: mode.color, borderColor: `${mode.color}50` }
                      : {}
                  }
                >
                  <mode.icon className="h-4 w-4" />
                  <span>{mode.name}</span>
                  <span className="text-xs opacity-70">{mode.price}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="描述创作需求后发送（action: discuss）…"
                className="flex-1 rounded-xl border border-[#2A2A36] bg-[#12121A] px-4 py-3 text-[#EEF2EA] placeholder-[#9BA89F] outline-none transition-colors focus:border-[#C9A84C]"
                disabled={isDiscussing || !isConnected}
              />
              <button
                type="submit"
                disabled={isDiscussing || !input.trim() || !isConnected}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C] text-[#0A0A0F] transition-all hover:bg-[#D4B65C] disabled:opacity-50"
                title={!isConnected ? "等待 WebSocket 连接" : undefined}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden w-80 border-l border-[#2A2A36] bg-[#0A0A0F] lg:block">
        <div className="p-4">
          <h2 className="mb-4 font-semibold text-[#EEF2EA]">当前状态</h2>

          <div className="mb-6 rounded-xl border border-[#2A2A36] bg-[#12121A] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-[#9BA89F]">WebSocket</span>
              <span className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: isConnected ? "#29bf69" : "#c0392b",
                  }}
                />
                <span className={isConnected ? "text-[#29bf69]" : "text-[#c0392b]"}>
                  {isConnected ? "已连接" : "断开"}
                </span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#6b7280]">
              断开后 {RECONNECT_MS / 1000}s 自动重连 · 默认 {WS_DEFAULT}
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-[#2A2A36] bg-[#12121A] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-[#9BA89F]">运行模式</span>
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: `${selectedMode.color}20`, color: selectedMode.color }}
              >
                <selectedMode.icon className="h-3 w-3" />
                {selectedMode.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#0A0A0F] p-3 text-center">
                <div className="text-lg font-bold text-[#EEF2EA]">{displayModels}</div>
                <div className="text-xs text-[#9BA89F]">参与模型</div>
              </div>
              <div className="rounded-lg bg-[#0A0A0F] p-3 text-center">
                <div className="text-lg font-bold text-[#EEF2EA]">{selectedMode.rounds}</div>
                <div className="text-xs text-[#9BA89F]">讨论轮次(示意)</div>
              </div>
            </div>
          </div>

          {isDiscussing && (
            <div className="mb-6 rounded-xl border border-[#2A2A36] bg-[#12121A] p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#C9A84C]" />
                <span className="text-sm font-medium text-[#EEF2EA]">讨论进行中</span>
              </div>
              <p className="text-xs text-[#9BA89F]">等待服务端推送 ai → vote → consensus → done</p>
            </div>
          )}

          <div className="rounded-xl border border-[#2A2A36] bg-[#12121A] p-4">
            <h3 className="mb-3 text-sm font-medium text-[#EEF2EA]">费用预估</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9BA89F]">本次讨论</span>
                <span className="font-medium text-[#C9A84C]">{selectedMode.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9BA89F]">账户余额</span>
                <span className="text-sm text-[#EEF2EA]">$10.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
