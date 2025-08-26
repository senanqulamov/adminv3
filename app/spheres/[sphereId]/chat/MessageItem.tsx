"use client"

import { ChatMessage } from "./types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { File as FileIcon, MessageSquareReply } from "lucide-react"
import { useMemo } from "react"
import { useUpsertReaction } from "./useChatMessages"
import { useChatStore } from "./store"

interface Props {
  message: ChatMessage
  currentUserId: string
  sphereId: string
}

const DEFAULT_EMOJIS = ["👍", "❤️", "😀", "🎉", "🙏"]

export default function MessageItem({ message, currentUserId, sphereId }: Props) {
  const setReplyToMessageId = useChatStore((s) => s.setReplyToMessageId)
  const selectedThreadId = useChatStore((s) => s.selectedThreadId)
  const upsertReaction = useUpsertReaction(currentUserId)

  const name = message.userName ?? (message.userId === "system" ? "System" : "User")
  const avatar = message.userAvatar ?? undefined

  const reactionSummary = useMemo(() => {
    const map = new Map<string, { emoji: string; count: number; reacted: boolean }>()
    for (const r of message.reactions ?? []) {
      const entry = map.get(r.emoji) ?? { emoji: r.emoji, count: 0, reacted: false }
      entry.count += 1
      if (r.userId === currentUserId) entry.reacted = true
      map.set(r.emoji, entry)
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [message.reactions, currentUserId])

  const onReact = (emoji: string) => {
    upsertReaction.mutate({
      sphereId,
      threadId: selectedThreadId ?? null,
      messageId: message.id,
      emoji,
      op: "toggle",
    })
  }

  const timestamp = format(new Date(message.createdAt), "PP p")

  return (
    <div className="group grid grid-cols-[40px_1fr] gap-3">
      <div className="pt-0.5">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="text-[11px] text-muted-foreground">{timestamp}</span>
        </div>

        <MessageBody message={message} />

        {/* Reactions + actions */}
        <div className="mt-1 flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {reactionSummary.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact(r.emoji)}
                className={cn(
                  "px-1.5 py-0.5 rounded-md text-xs border border-border/60 bg-muted/30 hover:bg-muted/50",
                  r.reacted && "border-primary/60 bg-primary/10"
                )}
              >
                <span className="mr-1">{r.emoji}</span>
                <span className="text-muted-foreground">{r.count}</span>
              </button>
            ))}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              {DEFAULT_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => onReact(e)}
                  className="px-1.5 py-0.5 rounded-md text-xs border border-border/60 bg-muted/30 hover:bg-muted/50"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => setReplyToMessageId(message.id)}
              title="Reply"
            >
              <MessageSquareReply className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBody({ message }: { message: ChatMessage }) {
  if (message.type === "system")
    return <div className="text-xs text-muted-foreground italic">{message.content}</div>

  return (
    <div className="mt-0.5 space-y-2">
      {message.content && (
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
      )}

      {message.attachments && message.attachments.length > 0 && (
        <div className="flex flex-col gap-2">
          {message.attachments.map((a) => (
            <AttachmentPreview key={a.id} type={a.type} url={a.url} name={a.name} />
          ))}
        </div>
      )}
    </div>
  )
}

function AttachmentPreview({ type, url, name }: { type: "image" | "file"; url: string; name?: string }) {
  if (type === "image") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={name ?? "image"} className="max-h-64 rounded-lg border border-border" />
      </a>
    )
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
    >
      <FileIcon className="h-4 w-4" />
      <span>{name ?? url}</span>
    </a>
  )
}
