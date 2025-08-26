export type ChatMessageType = "text" | "image" | "file" | "system"

export interface ChatThread {
  id: string
  sphereId: string
  key: string // e.g., "general"
  name: string
  createdAt: string
  updatedAt: string
}

export interface ChatAttachment {
  id: string
  messageId: string
  type: "image" | "file"
  url: string
  name?: string
  size?: number
  mimeType?: string
  width?: number
  height?: number
}

export interface ChatReaction {
  emoji: string // e.g., "👍", "😀"
  userId: string
}

export interface ChatReadReceipt {
  userId: string
  readAt: string
}

export interface ChatMessage {
  id: string
  sphereId: string
  threadId?: string | null
  userId: string | "system"
  userName?: string
  userAvatar?: string | null
  type: ChatMessageType
  content?: string | null
  attachments?: ChatAttachment[]
  reactions?: ChatReaction[]
  reads?: ChatReadReceipt[]
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface MessagesResponse {
  messages: ChatMessage[]
  nextCursor?: string | null
  hasMore?: boolean
  total?: number
}

export type ChatSocketEvent =
  | { type: "message:new"; payload: ChatMessage }
  | { type: "message:edit"; payload: ChatMessage }
  | { type: "message:delete"; payload: { id: string } }
  | { type: "reaction:upsert"; payload: { messageId: string; reaction: ChatReaction; op: "add" | "remove" } }
  | { type: "typing:start"; payload: { userId: string; userName?: string; threadId?: string | null } }
  | { type: "typing:stop"; payload: { userId: string; threadId?: string | null } }
  | { type: "typing"; payload: { userId: string; userName?: string; threadId?: string | null } }
  | { type: "read:updated"; payload: { userId: string; userName?: string; threadId?: string | null; lastReadMessageId: string } }
