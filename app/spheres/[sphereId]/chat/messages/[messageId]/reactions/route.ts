import { NextRequest, NextResponse } from "next/server"
import { upsertReaction } from "../../../_mockDb"
import { chatHub } from "@/lib/chatWsHub"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, ctx: { params: Promise<{ sphereId: string; messageId: string }> }) {
  const { sphereId, messageId } = await ctx.params
  const body = await req.json()
  const emoji = String(body?.emoji ?? "")
  const op = (body?.op ?? "toggle") as "toggle" | "add" | "remove"
  if (!emoji) return NextResponse.json({ error: true, message: "emoji required" }, { status: 400 })
  // For demo use a fixed user id
  const userId = "admin"
  const reaction = upsertReaction(sphereId, messageId, emoji, userId, op)
  chatHub.broadcast(sphereId, {
    type: "reaction:upsert",
    payload: { messageId, reaction: reaction ?? { emoji, userId }, op },
  })
  return NextResponse.json({ data: reaction })
}
