export type SseController = {
  write: (data: string) => void
  close: () => void
}

class SseHub {
  private spheres = new Map<string, Set<SseController>>()

  register(sphereId: string, controller: SseController) {
    let set = this.spheres.get(sphereId)
    if (!set) {
      set = new Set<SseController>()
      this.spheres.set(sphereId, set)
    }
    set.add(controller)
  }

  unregister(sphereId: string, controller: SseController) {
    const set = this.spheres.get(sphereId)
    if (!set) return
    set.delete(controller)
    if (set.size === 0) this.spheres.delete(sphereId)
  }

  broadcast(sphereId: string, event: any) {
    const set = this.spheres.get(sphereId)
    if (!set || set.size === 0) return
    const payload = `data: ${JSON.stringify(event)}\n\n`
    for (const c of set) {
      try {
        c.write(payload)
      } catch {
        // ignore
      }
    }
  }
}

const g = globalThis as any
if (!g.__sseHub) g.__sseHub = new SseHub()
export const sseHub: SseHub = g.__sseHub

