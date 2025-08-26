import { chatHub } from "@/lib/chatWsHub"

export const runtime = "edge"

export async function GET(_req: Request, ctx: { params: Promise<{ sphereId: string }> }) {
  const { sphereId } = await ctx.params
  const pair = new (globalThis as any).WebSocketPair()
  const [client, server] = [pair[0], pair[1]] as [any, any]

  // Accept the server-side socket (Edge runtime)
  ;(server as any).accept()

  chatHub.register(sphereId, server as any)

  server.addEventListener("message", (evt: MessageEvent) => {
    try {
      const data = JSON.parse(String((evt as any).data))
      if (data?.type === "typing") {
        chatHub.broadcast(sphereId, {
          type: "typing",
          payload: { userId: "admin", userName: "Admin", threadId: data?.payload?.threadId ?? null },
        })
      }
    } catch {
      // ignore
    }
  })

  server.addEventListener("close", () => {
    try { server.close() } catch {}
  })

  // Return the client socket to the requester
  return new Response(null as any, { status: 101, webSocket: client } as any)
}
