"use client"

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChatMessage, ChatReaction, ChatThread, MessagesResponse } from "./types"

const PAGE_SIZE = 30

export const getThreadsQueryKey = (sphereId: string) => ["chat", sphereId, "threads"] as const
export const getMessageQueryKey = (sphereId: string, threadId: string | null) =>
  ["chat", sphereId, "messages", threadId ?? "__feed__"] as const

async function fetchThreads(sphereId: string): Promise<ChatThread[]> {
  const res = await fetch(`/spheres/${sphereId}/chat/threads`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch threads")
  const json = await res.json()
  // Expect { data: ChatThread[] } or raw array; support both
  return json?.data ?? json
}

async function fetchMessages(
  sphereId: string,
  threadId: string | null,
  cursor?: string | null
): Promise<MessagesResponse> {
  const params = new URLSearchParams()
  params.set("limit", String(PAGE_SIZE))
  if (cursor) params.set("cursor", cursor)
  const base = threadId
    ? `/spheres/${sphereId}/chat/threads/${threadId}/messages`
    : `/spheres/${sphereId}/chat/messages`
  const res = await fetch(`${base}?${params.toString()}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch messages")
  const json = await res.json()
  // Expect { messages, nextCursor } or raw array
  if (Array.isArray(json)) return { messages: json, nextCursor: null }
  if (json?.data && Array.isArray(json.data)) return { messages: json.data, nextCursor: json.nextCursor ?? null }
  return { messages: json.messages ?? [], nextCursor: json.nextCursor ?? null }
}

export function useThreads(sphereId: string) {
  return useQuery({
    queryKey: getThreadsQueryKey(sphereId),
    queryFn: () => fetchThreads(sphereId),
  })
}

export function useChatMessages(sphereId: string, threadId: string | null) {
  return useInfiniteQuery({
    queryKey: getMessageQueryKey(sphereId, threadId),
    queryFn: ({ pageParam }) => fetchMessages(sphereId, threadId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  })
}

export interface SendMessageInput {
  sphereId: string
  threadId: string | null
  content?: string
  type?: ChatMessage["type"]
  attachments?: { url: string; type: "image" | "file"; name?: string; size?: number; mimeType?: string }[]
}

export function useSendMessage(currentUser: { id: string; name?: string; avatar?: string | null }) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const body: any = {
        content: input.content ?? null,
        type: input.type ?? (input.attachments?.length ? (input.attachments[0].type === "image" ? "image" : "file") : "text"),
        attachments: input.attachments ?? [],
      }
      const base = input.threadId
        ? `/spheres/${input.sphereId}/chat/threads/${input.threadId}/messages`
        : `/spheres/${input.sphereId}/chat/messages`
      const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to send message")
      const json = await res.json()
      return json?.data ?? json
    },
    onMutate: async (input) => {
      const key = getMessageQueryKey(input.sphereId, input.threadId)
      await qc.cancelQueries({ queryKey: key })

      const previous = qc.getQueryData<ReturnType<typeof structure>>(
        key as unknown as any
      ) as any

      const optimistic: ChatMessage = {
        id: `temp-${Date.now()}`,
        sphereId: input.sphereId,
        threadId: input.threadId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar ?? undefined,
        type: input.type ?? (input.attachments?.length ? (input.attachments[0].type === "image" ? "image" : "file") : "text"),
        content: input.content ?? null,
        attachments: input.attachments?.map((a, i) => ({
          id: `temp-att-${Date.now()}-${i}`,
          messageId: "",
          type: a.type,
          url: a.url,
          name: a.name,
          size: a.size,
          mimeType: a.mimeType,
        })),
        reactions: [],
        reads: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Insert optimistic message into the latest page
      qc.setQueryData<any>(key as unknown as any, (old: any) => {
        if (!old) {
          return { pages: [{ messages: [optimistic], nextCursor: null }], pageParams: [undefined] }
        }
        const pages = [...old.pages]
        if (pages.length === 0) {
          pages.push({ messages: [optimistic], nextCursor: null })
        } else {
          pages[0] = { ...pages[0], messages: [...(pages[0].messages ?? []), optimistic] }
        }
        return { ...old, pages }
      })

      return { previous }
    },
    onError: (_err, input, ctx) => {
      const key = getMessageQueryKey(input.sphereId, input.threadId)
      if (ctx?.previous) qc.setQueryData(key as unknown as any, ctx.previous)
    },
    onSettled: (_data, _err, input) => {
      qc.invalidateQueries({ queryKey: getMessageQueryKey(input.sphereId, input.threadId) })
    },
  })
}

export function useUpsertReaction(currentUserId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { sphereId: string; threadId: string | null; messageId: string; emoji: string; op?: "toggle" | "add" | "remove" }) => {
      // Backend contract: POST upsert
      const op = input.op ?? "toggle"
      const res = await fetch(`/spheres/${input.sphereId}/chat/messages/${input.messageId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji: input.emoji, op }),
      })
      if (!res.ok) throw new Error("Failed to update reaction")
      const json = await res.json()
      return json?.data ?? json
    },
    onMutate: async (input) => {
      const key = getMessageQueryKey(input.sphereId, input.threadId)
      await qc.cancelQueries({ queryKey: key })
      const previous = qc.getQueryData<any>(key as unknown as any)
      const toggle = (reactions: ChatReaction[] | undefined, emoji: string): ChatReaction[] => {
        const list = [...(reactions ?? [])]
        const idx = list.findIndex((r) => r.emoji === emoji && r.userId === currentUserId)
        if (idx >= 0) {
          list.splice(idx, 1)
        } else {
          list.push({ emoji, userId: currentUserId })
        }
        return list
      }
      qc.setQueryData<any>(key as unknown as any, (old: any) => {
        if (!old) return old
        const pages = old.pages.map((p: any) => ({
          ...p,
          messages: p.messages.map((m: any) => (m.id === input.messageId ? { ...m, reactions: toggle(m.reactions, input.emoji) } : m)),
        }))
        return { ...old, pages }
      })
      return { previous }
    },
    onError: (_err, input, ctx) => {
      const key = getMessageQueryKey(input.sphereId, input.threadId)
      if (ctx?.previous) qc.setQueryData(key as unknown as any, ctx.previous)
    },
    onSettled: (_res, _err, input) => {
      qc.invalidateQueries({ queryKey: getMessageQueryKey(input.sphereId, input.threadId) })
    },
  })
}

// Helper only to satisfy TS generic inference above in onMutate; not used otherwise
function structure() {
  return { pages: [{ messages: [] as ChatMessage[], nextCursor: null as string | null }], pageParams: [undefined as string | undefined] }
}
