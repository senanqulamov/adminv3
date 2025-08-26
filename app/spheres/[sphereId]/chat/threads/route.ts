import { NextResponse } from "next/server"
import { getThreads } from "../_mockDb"

export const dynamic = "force-dynamic"

export async function GET(_req: Request, ctx: { params: Promise<{ sphereId: string }> }) {
  const { sphereId } = await ctx.params
  const threads = getThreads(sphereId)
  return NextResponse.json({ data: threads })
}
