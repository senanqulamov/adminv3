import { NextRequest, NextResponse } from "next/server"
import { chatHub } from "@/lib/chatWsHub"
import { createMessage, listMessages } from "../../../_mockDb"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, ctx: { params: Promise<{ sphereId: string; threadId: string }> }) {
  const { sphereId, threadId } = await ctx.params
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get("cursor")
  const limit = Number(searchParams.get("limit") ?? 30)
  const out = listMessages(sphereId, threadId, cursor, limit)
  return NextResponse.json(out)
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ sphereId: string; threadId: string }> }) {
  const { sphereId, threadId } = await ctx.params
  const body = await req.json()
  const m = createMessage({
    sphereId,
    threadId,
    userId: "admin",
    userName: "Admin",
    userAvatar: "/placeholder-user.jpg",
    content: body?.content ?? null,
    type: body?.type ?? "text",
    attachments: body?.attachments ?? [],
  })
  chatHub.broadcast(sphereId, { type: "message:new", payload: m })
  return NextResponse.json({ data: m })
}
