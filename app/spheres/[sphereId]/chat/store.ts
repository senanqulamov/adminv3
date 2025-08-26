import { create } from "zustand"

interface TypingUser {
  userId: string
  userName?: string
  threadId?: string | null
  lastSeen: number // ms epoch
  expiry: number // ms epoch when this entry should be considered stale
}

interface ParticipantRead {
  userId: string
  userName?: string
  lastReadMessageId?: string
}

// Presence types
export interface PresenceUser {
  userId: string
  userName?: string
  online: boolean
  lastSeen?: number
}

interface ChatStoreState {
  selectedThreadId: string | null
  setSelectedThreadId: (id: string | null) => void

  // Typing
  typingUsers: Map<string, TypingUser>
  upsertTyping: (u: Omit<TypingUser, "lastSeen" | "expiry">) => void
  clearOldTyping: (ttlMs?: number) => void
  removeTyping: (userId: string) => void

  // Read/unread and participants
  currentUserId: string | null
  setCurrentUserId: (id: string) => void
  participantsByThread: Map<string, Map<string, ParticipantRead>>
  setParticipantRead: (threadKey: string, userId: string, lastReadMessageId: string, userName?: string) => void
  unreadByThread: Map<string, number>
  setUnread: (threadKey: string, count: number) => void

  // Presence by sphere
  participantsBySphere: Map<string, PresenceUser[]>
  setPresenceList: (sphereId: string, list: PresenceUser[]) => void
  upsertPresenceUser: (sphereId: string, user: PresenceUser) => void
  setUserOnline: (sphereId: string, userId: string, online: boolean, userName?: string, lastSeen?: number) => void
  markSphereOffline: (sphereId: string) => void

  replyToMessageId: string | null
  setReplyToMessageId: (id: string | null) => void
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  selectedThreadId: null,
  setSelectedThreadId: (id) => set({ selectedThreadId: id }),

  // Typing
  typingUsers: new Map<string, TypingUser>(),
  upsertTyping: (u) =>
    set((s) => {
      const now = Date.now()
      const next = new Map(s.typingUsers)
      next.set(u.userId, { ...u, lastSeen: now, expiry: now + 5000 })
      return { typingUsers: next }
    }),
  clearOldTyping: (ttlMs = 5000) => {
    const now = Date.now()
    const next = new Map(get().typingUsers)
    for (const [id, entry] of next.entries()) {
      const isExpired = entry.expiry ? now >= entry.expiry : now - entry.lastSeen >= ttlMs
      if (isExpired) next.delete(id)
    }
    set({ typingUsers: next })
  },
  removeTyping: (userId) =>
    set((s) => {
      const next = new Map(s.typingUsers)
      next.delete(userId)
      return { typingUsers: next }
    }),

  // Read/unread and participants
  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),
  participantsByThread: new Map<string, Map<string, ParticipantRead>>(),
  setParticipantRead: (threadKey, userId, lastReadMessageId, userName) =>
    set((s) => {
      const nextThreads = new Map(s.participantsByThread)
      const existingThread = new Map(nextThreads.get(threadKey) ?? [])
      const prev = existingThread.get(userId)
      existingThread.set(userId, { userId, userName: userName ?? prev?.userName, lastReadMessageId })
      nextThreads.set(threadKey, existingThread)
      return { participantsByThread: nextThreads }
    }),
  unreadByThread: new Map<string, number>(),
  setUnread: (threadKey, count) =>
    set((s) => {
      const next = new Map(s.unreadByThread)
      next.set(threadKey, Math.max(0, count))
      return { unreadByThread: next }
    }),

  // Presence by sphere
  participantsBySphere: new Map<string, PresenceUser[]>(),
  setPresenceList: (sphereId, list) =>
    set((s) => {
      const next = new Map(s.participantsBySphere)
      // Sort by online desc, then by userName/userId
      const sorted = [...list].sort((a, b) => {
        if (a.online !== b.online) return a.online ? -1 : 1
        const an = (a.userName ?? a.userId).toLowerCase()
        const bn = (b.userName ?? b.userId).toLowerCase()
        return an.localeCompare(bn)
      })
      next.set(sphereId, sorted)
      return { participantsBySphere: next }
    }),
  upsertPresenceUser: (sphereId, user) =>
    set((s) => {
      const next = new Map(s.participantsBySphere)
      const list = [...(next.get(sphereId) ?? [])]
      const idx = list.findIndex((u) => u.userId === user.userId)
      if (idx >= 0) list[idx] = { ...list[idx], ...user }
      else list.push(user)
      next.set(sphereId, list)
      return { participantsBySphere: next }
    }),
  setUserOnline: (sphereId, userId, online, userName, lastSeen) =>
    set((s) => {
      const next = new Map(s.participantsBySphere)
      const list = [...(next.get(sphereId) ?? [])]
      const idx = list.findIndex((u) => u.userId === userId)
      const now = Date.now()
      if (idx >= 0) list[idx] = { ...list[idx], online, userName: userName ?? list[idx].userName, lastSeen: lastSeen ?? (online ? now : list[idx].lastSeen ?? now) }
      else list.push({ userId, userName, online, lastSeen: online ? now : lastSeen })
      next.set(sphereId, list)
      return { participantsBySphere: next }
    }),
  markSphereOffline: (sphereId) =>
    set((s) => {
      const next = new Map(s.participantsBySphere)
      const list = [...(next.get(sphereId) ?? [])].map((u) => ({ ...u, online: false }))
      next.set(sphereId, list)
      return { participantsBySphere: next }
    }),

  replyToMessageId: null,
  setReplyToMessageId: (id) => set({ replyToMessageId: id }),
}))
