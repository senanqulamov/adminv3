// import { NextRequest } from "next/server"
import { ChatAttachment, ChatMessage, ChatReaction, ChatThread, MessagesResponse } from "./types"

// Simple in-memory DB for local testing. Data resets on server restart.

type SphereData = {
  threads: ChatThread[]
  feed: ChatMessage[]
  byThread: Record<string, ChatMessage[]>
}

const db: Record<string, SphereData> = {}

function seedSphere(sphereId: string) {
  if (db[sphereId]) return db[sphereId]
  const now = new Date()
  const threads: ChatThread[] = [
    { id: "t_discussions", sphereId, key: "discussions", name: "discussions", createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: "t_questions", sphereId, key: "questions", name: "questions", createdAt: now.toISOString(), updatedAt: now.toISOString() },
  ]
  const feed: ChatMessage[] = [
    {
      id: "m1",
      sphereId,
      threadId: null,
      userId: "system",
      userName: "System",
      type: "system",
      content: "Welcome to Sphere chat!",
      attachments: [],
      reactions: [],
      reads: [],
      createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "m2",
      sphereId,
      threadId: null,
      userId: "u_alice",
      userName: "Alice",
      userAvatar: "/placeholder-user.jpg",
      type: "text",
      content: "Hey team, let’s kick things off.",
      attachments: [],
      reactions: [{ emoji: "👍", userId: "u_bob" }],
      reads: [],
      createdAt: new Date(now.getTime() - 1000 * 30).toISOString(),
      updatedAt: now.toISOString(),
    },
  ]
  const byThread: Record<string, ChatMessage[]> = {
    t_discussions: [
      {
        id: "tm1",
        sphereId,
        threadId: "t_discussions",
        userId: "u_bob",
        userName: "Bob",
        userAvatar: "/placeholder-user.jpg",
        type: "text",
        content: "What do we want to cover this week?",
        attachments: [],
        reactions: [],
        reads: [],
        createdAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
        updatedAt: now.toISOString(),
      },
    ],
  }
  db[sphereId] = { threads, feed, byThread }
  return db[sphereId]
}

export function getThreads(sphereId: string): ChatThread[] {
  const s = seedSphere(sphereId)
  return s.threads
}

function getStoreFor(sphereId: string, threadId: string | null): ChatMessage[] {
  const s = seedSphere(sphereId)
  if (!threadId) return s.feed
  if (!s.byThread[threadId]) s.byThread[threadId] = []
  return s.byThread[threadId]
}

export function listMessages(sphereId: string, threadId: string | null, cursor?: string | null, limit = 30): MessagesResponse {
  const arr = getStoreFor(sphereId, threadId)
  // Ensure ascending by createdAt
  arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  if (!arr.length) return { messages: [], nextCursor: null }

  // Cursor is an index (stringified). If undefined, start from end (latest page).
  const endIndex = typeof cursor === "string" ? Math.max(0, Math.min(arr.length - 1, parseInt(cursor))) : arr.length - 1
  const startIndex = Math.max(0, endIndex - limit + 1)
  const slice = arr.slice(startIndex, endIndex + 1)
  const nextCursor = startIndex > 0 ? String(startIndex - 1) : null
  return { messages: slice, nextCursor }
}

export function createMessage(params: {
  sphereId: string
  threadId: string | null
  userId: string
  userName?: string
  userAvatar?: string | null
  content?: string | null
  type: ChatMessage["type"]
  attachments?: ChatAttachment[]
}): ChatMessage {
  const arr = getStoreFor(params.sphereId, params.threadId)
  const m: ChatMessage = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    sphereId: params.sphereId,
    threadId: params.threadId,
    userId: params.userId,
    userName: params.userName,
    userAvatar: params.userAvatar ?? undefined,
    type: params.type,
    content: params.content ?? null,
    attachments: params.attachments ?? [],
    reactions: [],
    reads: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  arr.push(m)
  return m
}

export function upsertReaction(sphereId: string, messageId: string, emoji: string, userId: string, op: "toggle" | "add" | "remove" = "toggle"): ChatReaction | null {
  const s = seedSphere(sphereId)
  const allArrays = [s.feed, ...Object.values(s.byThread)]
  for (const arr of allArrays) {
    const msg = arr.find((x) => x.id === messageId)
    if (!msg) continue
    const reactions = msg.reactions ?? (msg.reactions = [])
    const idx = reactions.findIndex((r) => r.emoji === emoji && r.userId === userId)
    if (op === "remove" || (op === "toggle" && idx >= 0)) {
      if (idx >= 0) reactions.splice(idx, 1)
      return null
    }
    if (op === "add" || (op === "toggle" && idx < 0)) {
      const r: ChatReaction = { emoji, userId }
      reactions.push(r)
      return r
    }
  }
  return null
}

