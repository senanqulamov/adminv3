"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, Smile } from "lucide-react"
import { useSendMessage } from "./useChatMessages"
import { useChatStore } from "./store"
import { useChatSocket } from "./useChatSocket"

interface Props {
  sphereId: string
  threadId: string | null
  currentUser: { id: string; name?: string; avatar?: string | null }
}

export default function MessageInput({ sphereId, threadId, currentUser }: Props) {
  const [value, setValue] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { sendTyping, stopTyping } = useChatSocket(sphereId)
  const sendMessage = useSendMessage(currentUser)
  const replyToMessageId = useChatStore((s) => s.replyToMessageId)
  const setReplyToMessageId = useChatStore((s) => s.setReplyToMessageId)

  useEffect(() => {
    autoResize()
    return () => {
      // send a stop when unmounting to clear indicators
      stopTyping(threadId)
    }
  }, [value])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      doSend()
      return
    }
    // Lightweight typing signal
    if (!e.shiftKey) sendTyping(threadId)
  }

  const onBlur = () => {
    stopTyping(threadId)
  }

  const doSend = async () => {
    const trimmed = value.trim()
    if (!trimmed && files.length === 0) return

    const uploaded = await uploadAttachments(files)

    sendMessage.mutate({
      sphereId,
      threadId,
      content: trimmed.length ? trimmed : undefined,
      attachments: uploaded,
      type: uploaded.length ? (uploaded[0].type === "image" ? "image" : "file") : "text",
    })

    // stop typing upon send
    stopTyping(threadId)

    setValue("")
    setFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (replyToMessageId) setReplyToMessageId(null)
  }

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files ?? [])
    if (f.length) setFiles((prev) => [...prev, ...f])
  }

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx))

  return (
    <div className="flex flex-col gap-2">
      {replyToMessageId && (
        <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-1">
          <span>Replying…</span>
          <button className="hover:underline" onClick={() => setReplyToMessageId(null)}>Cancel</button>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="flex items-center gap-2 text-xs bg-muted/30 border border-border/60 px-2 py-1 rounded-md">
              <span className="truncate max-w-[160px]">{f.name}</span>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => removeFile(i)}>×</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder="Write a message…"
            className="min-h-[44px] max-h-[200px] resize-none rounded-xl bg-muted/20 border-border focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 pb-1">
          <input ref={fileInputRef} type="file" className="hidden" multiple onChange={onPickFiles} />
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => fileInputRef.current?.click()} title="Attach">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" disabled title="Emoji">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={doSend} disabled={sendMessage.isPending} className="rounded-xl">
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

// Upload stub that returns temporary object URLs. Replace with your storage upload.
async function uploadAttachments(files: File[]): Promise<{ url: string; type: "image" | "file"; name?: string; size?: number; mimeType?: string }[]> {
  const out: { url: string; type: "image" | "file"; name?: string; size?: number; mimeType?: string }[] = []
  for (const f of files) {
    const url = URL.createObjectURL(f)
    const isImage = /^image\//.test(f.type)
    out.push({ url, type: isImage ? "image" : "file", name: f.name, size: f.size, mimeType: f.type })
  }
  // Simulate latency
  await new Promise((r) => setTimeout(r, 150))
  return out
}
