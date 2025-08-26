"use client"

import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getMessageQueryKey } from "./useChatMessages"
import { useChatStore } from "./store"
import { toast } from "sonner"

function getWsBase() {
  if (typeof window === "undefined") return ""
  const env = process.env.NEXT_PUBLIC_WS_URL
  if (env) return env.replace(/\/$/, "")
  const origin = window.location.origin
  return origin.replace(/^http/, "ws")
}

// Normalized WS frame shape
interface NormalizedFrame<T = any> {
  type: string
  data?: T
  success: boolean
  error?: unknown
  message?: string
}

function normalizeFrame(raw: any): NormalizedFrame | null {
  if (!raw || typeof raw !== "object") return null
  const type = (raw.type ?? raw.event ?? raw.op ?? "").toString()
  // prefer "data", fallback to common alternatives
  const data = raw.data ?? raw.payload ?? raw.body ?? undefined
  // success heuristic: explicit success wins; otherwise error presence implies failure; else assume success
  const hasSuccess = Object.prototype.hasOwnProperty.call(raw, "success")
  const success = hasSuccess ? !!raw.success : !raw.error
  const error = raw.error === true ? "Error" : raw.error
  const message = typeof raw.message === "string" ? raw.message : (typeof raw.error === "string" ? raw.error : undefined)
  return { type, data, success, error, message }
}

export function useChatSocket(sphereId: string) {
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const qc = useQueryClient()
  const upsertTyping = useChatStore((s) => s.upsertTyping)
  const clearOldTyping = useChatStore((s) => s.clearOldTyping)
  const removeTyping = useChatStore((s) => s.removeTyping)
  const setParticipantRead = useChatStore((s) => s.setParticipantRead)
  const setUnread = useChatStore((s) => s.setUnread)
  const currentUserId = useChatStore((s) => s.currentUserId)
  const selectedThreadId = useChatStore((s) => s.selectedThreadId)
  const setPresenceList = useChatStore((s) => s.setPresenceList)
  const setUserOnline = useChatStore((s) => s.setUserOnline)
  const markSphereOffline = useChatStore((s) => s.markSphereOffline)
  const selectedThreadIdRef = useRef<string | null>(selectedThreadId)
  useEffect(() => { selectedThreadIdRef.current = selectedThreadId }, [selectedThreadId])

  // Debounce control for local typing signals
  const lastStartSentAtRef = useRef<number>(0)
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reconnect control
  const shouldReconnectRef = useRef<boolean>(true)
  const reconnectAttemptsRef = useRef<number>(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    shouldReconnectRef.current = true

    const setupSocket = () => {
      // clear any pending timer
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      let ws: WebSocket
      try {
        ws = new WebSocket(`${getWsBase()}/ws/chat/${sphereId}`)
      } catch (_e) {
        setConnected(false)
        // schedule reconnect
        scheduleReconnect()
        return
      }
      wsRef.current = ws

      const onOpen = () => {
        setConnected(true)
        reconnectAttemptsRef.current = 0
      }
      const onClose = () => {
        setConnected(false)
        try { markSphereOffline(sphereId) } catch {}
        scheduleReconnect()
      }
      const onMessage = (ev: MessageEvent) => {
        try {
          const raw = JSON.parse(ev.data) as any
          const frame = normalizeFrame(raw)
          if (!frame || !frame.type) return

          // Error/unsuccessful frames -> toast/log, then stop
          if (!frame.success) {
            const msg = frame.message ?? (typeof frame.error === "string" ? frame.error : "Operation failed")
            toast.error(String(msg))
            if (process.env.NODE_ENV !== "production") console.warn("WS error frame", frame)
            return
          }

          switch (frame.type) {
            case "message:new": {
              const m = (frame.data as any)
              const key = getMessageQueryKey(m.sphereId, m.threadId ?? null)
              qc.setQueryData<any>(key as unknown as any, (old: any) => {
                if (!old) return old
                const pages = [...old.pages]
                if (pages.length === 0) pages.push({ messages: [], nextCursor: null })
                pages[0] = { ...pages[0], messages: [...pages[0].messages, m] }
                return { ...old, pages }
              })
              // update unread for other threads when message from others arrives
              if (m.userId !== currentUserId) {
                const threadKey = (m.threadId ?? null) ?? null
                const active = selectedThreadIdRef.current ?? null
                if (active !== threadKey) {
                  const curr = useChatStore.getState().unreadByThread.get(threadKey ?? "__feed__") ?? 0
                  setUnread((threadKey ?? "__feed__"), curr + 1)
                }
              }
              break
            }
            case "message:edit": {
              const m = (frame.data as any)
              const key = getMessageQueryKey(m.sphereId, m.threadId ?? null)
              qc.setQueryData<any>(key as unknown as any, (old: any) => {
                if (!old) return old
                const pages = old.pages.map((p: any) => ({
                  ...p,
                  messages: p.messages.map((x: any) => (x.id === m.id ? { ...x, ...m } : x)),
                }))
                return { ...old, pages }
              })
              break
            }
            case "message:delete": {
              const { id } = (frame.data as any)
              qc.getQueryCache()
                .findAll({ queryKey: ["chat", sphereId, "messages"] })
                .forEach((q) => {
                  const key = q.queryKey
                  qc.setQueryData<any>(key, (old: any) => {
                    if (!old) return old
                    const pages = old.pages.map((p: any) => ({
                      ...p,
                      messages: p.messages.filter((x: any) => x.id !== id),
                    }))
                    return { ...old, pages }
                  })
                })
              break
            }
            case "reaction:upsert": {
              const { messageId, reaction } = (frame.data as any)
              qc.getQueryCache()
                .findAll({ queryKey: ["chat", sphereId, "messages"] })
                .forEach((q) => {
                  const key = q.queryKey
                  qc.setQueryData<any>(key, (old: any) => {
                    if (!old) return old
                    const pages = old.pages.map((p: any) => ({
                      ...p,
                      messages: p.messages.map((m: any) => {
                        if (m.id !== messageId) return m
                        const list = [...(m.reactions ?? [])]
                        const idx = list.findIndex((r) => r.userId === reaction.userId && r.emoji === reaction.emoji)
                        if (idx >= 0) list.splice(idx, 1)
                        else list.push(reaction)
                        return { ...m, reactions: list }
                      }),
                    }))
                    return { ...old, pages }
                  })
                })
              break
            }
            case "typing:start": {
              const { userId, userName, threadId } = (frame.data as any)
              upsertTyping({ userId, userName, threadId: threadId ?? null })
              break
            }
            case "typing:stop": {
              const { userId } = (frame.data as any)
              removeTyping(userId)
              break
            }
            case "typing": { // legacy fallback treated as start
              const { userId, userName, threadId } = (frame.data as any)
              upsertTyping({ userId, userName, threadId: threadId ?? null })
              break
            }
            case "read:updated": {
              const { userId, userName, threadId, lastReadMessageId } = (frame.data as any)
              const threadKey = (threadId ?? null) ? (threadId as string) : "__feed__"
              setParticipantRead(threadKey, userId, lastReadMessageId, userName)
              if (userId === currentUserId) {
                setUnread(threadKey, 0)
              }
              break
            }
            case "presence:update": {
              const rawList = Array.isArray(frame.data) ? (frame.data as any[]) : ((frame.data as any)?.users ?? (frame.data as any)?.list ?? [])
              if (!Array.isArray(rawList)) break
              const list = rawList.map((u: any) => ({
                userId: u.userId ?? u.id,
                userName: u.userName ?? u.name,
                online: typeof u.online === "boolean" ? u.online : (u.status ? String(u.status).toLowerCase() === "online" : true),
                lastSeen: typeof u.lastSeen === "number" ? u.lastSeen : (u.lastSeen ? Date.parse(u.lastSeen) : undefined),
              }))
              setPresenceList(sphereId, list)
              break
            }
            case "presence:join": {
              const { userId, userName } = (frame.data as any)
              if (!userId) break
              setUserOnline(sphereId, userId, true, userName)
              break
            }
            case "presence:leave": {
              const { userId, userName, lastSeen } = (frame.data as any)
              if (!userId) break
              const ts = typeof lastSeen === "number" ? lastSeen : (lastSeen ? Date.parse(lastSeen) : undefined)
              setUserOnline(sphereId, userId, false, userName, ts)
              break
            }
            case "presence": {
              const d: any = frame.data
              if (!d) break
              if (Array.isArray(d) || d.users || d.list) {
                const rawList = Array.isArray(d) ? d : (d.users ?? d.list)
                const list = (rawList as any[]).map((u: any) => ({
                  userId: u.userId ?? u.id,
                  userName: u.userName ?? u.name,
                  online: typeof u.online === "boolean" ? u.online : (u.status ? String(u.status).toLowerCase() === "online" : true),
                  lastSeen: typeof u.lastSeen === "number" ? u.lastSeen : (u.lastSeen ? Date.parse(u.lastSeen) : undefined),
                }))
                setPresenceList(sphereId, list)
              } else if (d.userId) {
                const online = typeof d.online === "boolean" ? d.online : (d.status ? String(d.status).toLowerCase() === "online" : true)
                const ts = typeof d.lastSeen === "number" ? d.lastSeen : (d.lastSeen ? Date.parse(d.lastSeen) : undefined)
                setUserOnline(sphereId, d.userId, online, d.userName ?? d.name, ts)
              }
              break
            }
            default:
              break
          }
        } catch (_e) {
          // ignore
        }
      }

      ws.addEventListener("open", onOpen)
      ws.addEventListener("close", onClose)
      ws.addEventListener("message", onMessage)
    }

    const scheduleReconnect = () => {
      if (!shouldReconnectRef.current) return
      const attempt = reconnectAttemptsRef.current++
      const delay = Math.min(30000, 1000 * Math.pow(2, attempt))
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = setTimeout(() => {
        setupSocket()
      }, delay)
    }

    // initial connect
    setupSocket()

    return () => {
      shouldReconnectRef.current = false
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current)
        stopTimeoutRef.current = null
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      const ws = wsRef.current
      if (ws) {
        try {
          ws.close()
        } catch {}
      }
      wsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphereId])

  // Periodically purge stale typing indicators
  useEffect(() => {
    const iv = setInterval(() => clearOldTyping(5000), 1000)
    return () => clearInterval(iv)
  }, [clearOldTyping])

  const sendStart = (threadId?: string | null) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ type: "typing:start", payload: { threadId: threadId ?? null } }))
  }
  const sendStop = (threadId?: string | null) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ type: "typing:stop", payload: { threadId: threadId ?? null } }))
  }

  // Public API: debounced typing notifier
  const sendTyping = (threadId?: string | null) => {
    const now = Date.now()
    if (now - lastStartSentAtRef.current >= 2000) {
      sendStart(threadId)
      lastStartSentAtRef.current = now
    }
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current)
    stopTimeoutRef.current = setTimeout(() => {
      sendStop(threadId)
    }, 3000)
  }

  const stopTyping = (threadId?: string | null) => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current)
      stopTimeoutRef.current = null
    }
    sendStop(threadId)
  }

  // Public API: mark read via POST + WS, then update local store
  const markRead = async (uptoMessageId: string, threadId?: string | null) => {
    const threadKey = (threadId ?? null) ? (threadId as string) : "__feed__"
    // POST to REST endpoint (best-effort)
    try {
      const base = threadId ? `/spheres/${sphereId}/chat/threads/${threadId}/read` : `/spheres/${sphereId}/chat/read`
      await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uptoMessageId }),
      })
    } catch {
      // ignore
    }
    // WS notify
    try {
      const ws = wsRef.current
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "read:mark", payload: { threadId: threadId ?? null, uptoMessageId } }))
      }
    } catch { }
    // Local update
    if (currentUserId) setParticipantRead(threadKey, currentUserId, uptoMessageId)
    setUnread(threadKey, 0)
  }

  return { connected, sendTyping, stopTyping, markRead }
}
