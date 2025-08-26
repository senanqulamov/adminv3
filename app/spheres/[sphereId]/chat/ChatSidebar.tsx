"use client"

import { useEffect } from "react"
import { useThreads } from "./useChatMessages"
import { useChatStore } from "./store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Hash, MessageSquare } from "lucide-react"

// Stable empty list to avoid creating a new array in selectors (prevents getServerSnapshot loop)
const EMPTY_PRESENCE: ReadonlyArray<any> = Object.freeze([])

interface Props {
  sphereId: string
  onSelectThread?: () => void
}

export default function ChatSidebar({ sphereId, onSelectThread }: Props) {
  const { data, isLoading, isError } = useThreads(sphereId)
  const selectedThreadId = useChatStore((s) => s.selectedThreadId)
  const setSelectedThreadId = useChatStore((s) => s.setSelectedThreadId)
  const unreadByThread = useChatStore((s) => s.unreadByThread)
  // Use a stable reference when no presence list exists yet
  const presenceList = useChatStore((s) => s.participantsBySphere.get(sphereId) ?? EMPTY_PRESENCE)

  // Ensure a default selection (general feed -> null) the first time
  useEffect(() => {
    if (selectedThreadId === null) return
    // If selected thread no longer exists, reset to feed
    if (data && selectedThreadId && !data.find((t) => t.id === selectedThreadId)) {
      setSelectedThreadId(null)
    }
  }, [data, selectedThreadId, setSelectedThreadId])

  const onSelect = (id: string | null) => {
    setSelectedThreadId(id)
    onSelectThread?.()
  }

  const feedUnread = unreadByThread.get("__feed__") ?? 0
  const onlineCount = presenceList.filter((u: any) => u.online).length

  return (
    <div className="flex h-full w-full flex-col bg-muted/10">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Threads</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <SidebarItem
            icon={<Hash className="h-4 w-4" />}
            label="general"
            active={selectedThreadId === null}
            unread={feedUnread}
            onClick={() => onSelect(null)}
          />

          {isLoading && <div className="text-xs text-muted-foreground px-2 py-1">Loading…</div>}
          {isError && <div className="text-xs text-red-400 px-2 py-1">Failed to load threads</div>}

          {data?.map((t) => (
            <SidebarItem
              key={t.id}
              icon={<MessageSquare className="h-4 w-4" />}
              label={t.name}
              active={selectedThreadId === t.id}
              unread={unreadByThread.get(t.id) ?? 0}
              onClick={() => onSelect(t.id)}
            />
          ))}

          <div className="pt-3 mt-2 border-t border-border">
            <div className="px-2 mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Members</span>
              <span>{onlineCount}/{presenceList.length} online</span>
            </div>
            <div className="space-y-1">
              {presenceList.length === 0 && (
                <div className="text-xs text-muted-foreground px-2 py-1">No members</div>
              )}
              {(presenceList as any[]).map((u) => (
                <MemberRow key={u.userId} name={u.userName ?? u.userId} online={u.online} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-2 border-t border-border">
        {/* Future: Add new thread */}
        <Button variant="secondary" className="w-full" disabled>
          New thread (soon)
        </Button>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, unread = 0, onClick }: { icon: React.ReactNode; label: string; active?: boolean; unread?: number; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors",
        active ? "bg-accent text-foreground" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate flex-1">{label}</span>
      {unread > 0 && (
        <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-primary/20 text-primary text-[11px] font-semibold">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </button>
  )
}

function MemberRow({ name, online }: { name: string; online: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground">
      <span className={cn("inline-block h-2 w-2 rounded-full", online ? "bg-emerald-500" : "bg-zinc-400")} />
      <span className={cn("truncate", online ? "text-foreground" : "")}>{name}</span>
    </div>
  )
}
