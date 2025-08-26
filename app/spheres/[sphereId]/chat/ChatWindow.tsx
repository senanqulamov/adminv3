"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useThreads, useChatMessages } from "./useChatMessages"
import { useChatStore } from "./store"
import { useChatSocket } from "./useChatSocket"
import MessageItem from "./MessageItem"
import MessageInput from "./MessageInput"
import { Button } from "@/components/ui/button"
import { Loader2, WifiOff } from "lucide-react"

export default function ChatWindow({ sphereId }: { sphereId: string }) {
  const selectedThreadId = useChatStore((s) => s.selectedThreadId)
  const { data: threads } = useThreads(sphereId)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useChatMessages(
    sphereId,
    selectedThreadId
  )
  const { connected } = useChatSocket(sphereId)

  // Current user stub; wire this to your auth/user context
  const currentUser = { id: "admin", name: "Admin", avatar: "/placeholder-user.jpg" }
  const setCurrentUserId = useChatStore((s) => s.setCurrentUserId)
  useEffect(() => {
    setCurrentUserId(currentUser.id)
  }, [currentUser.id, setCurrentUserId])

  const messages = useMemo(() => {
    const list = data?.pages.flatMap((p) => p.messages) ?? []
    return [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [data])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [autoStick, setAutoStick] = useState(true)

  // Auto scroll to bottom when new messages arrive if user is near bottom
  useEffect(() => {
    if (!containerRef.current) return
    if (!autoStick) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages, autoStick])

  const onScroll = () => {
    const el = containerRef.current
    if (!el) return
    const nearTop = el.scrollTop < 80
    if (nearTop && hasNextPage && !isFetchingNextPage) {
      const prevHeight = el.scrollHeight
      fetchNextPage().then(() => {
        // keep visual position after prepend
        requestAnimationFrame(() => {
          const newHeight = el.scrollHeight
          el.scrollTop = newHeight - prevHeight
        })
      })
    }
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
    setAutoStick(nearBottom)
  }

  const threadName = useMemo(() => {
    if (!selectedThreadId) return "# general"
    const t = threads?.find((x) => x.id === selectedThreadId)
    return t ? `# ${t.name}` : "# thread"
  }, [selectedThreadId, threads])

  const typingUsers = useChatStore((s) => s.typingUsers)
  const typingDisplay = useMemo(() => {
    const list = Array.from(typingUsers.values()).filter((t) => (t.threadId ?? null) === (selectedThreadId ?? null))
    if (list.length === 0) return ""
    const names = list.map((t) => t.userName ?? "Someone").slice(0, 2).join(", ")
    return `${names} is typing…`
  }, [typingUsers, selectedThreadId])

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span className="font-semibold">{threadName}</span>
        </div>
        {!connected && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <WifiOff className="h-4 w-4" />
            Offline
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-background"
      >
        {hasNextPage && (
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</span>
              ) : (
                "Load older"
              )}
            </Button>
          </div>
        )}

        {isPending && (
          <div className="text-xs text-muted-foreground">Loading messages…</div>
        )}

        {messages.map((m) => (
          <MessageItem key={m.id} message={m} currentUserId={currentUser.id} sphereId={sphereId} />
        ))}
      </div>

      {/* Typing indicator */}
      {typingDisplay && (
        <div className="px-4 py-1 text-xs text-muted-foreground">{typingDisplay}</div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3">
        <MessageInput sphereId={sphereId} threadId={selectedThreadId} currentUser={currentUser} />
      </div>
    </div>
  )
}
