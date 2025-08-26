export type ChatEvent = any

class ChatHub {
  private spheres = new Map<string, Set<WebSocket>>()

  register(sphereId: string, socket: WebSocket) {
    let set = this.spheres.get(sphereId)
    if (!set) {
      set = new Set<WebSocket>()
      this.spheres.set(sphereId, set)
    }
    set.add(socket)
    socket.addEventListener("close", () => {
      set?.delete(socket)
      if (set && set.size === 0) this.spheres.delete(sphereId)
    })
  }

  broadcast(sphereId: string, event: ChatEvent) {
    const set = this.spheres.get(sphereId)
    if (!set || set.size === 0) return
    const str = JSON.stringify(event)
    for (const ws of set) {
      try {
        ws.send(str)
      } catch {
        // ignore
      }
    }
  }
}

const g = globalThis as any
if (!g.__chatHub) g.__chatHub = new ChatHub()
export const chatHub: ChatHub = g.__chatHub

