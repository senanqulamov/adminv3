"use client"

import { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { create } from "zustand"
import ChatSidebar from "./ChatSidebar"
import ChatWindow from "./ChatWindow"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

// Local UI store for chat page (sidebar state is colocated here to avoid global leakage)
interface ChatUIState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10_000,
    },
  },
})

export default function ChatPage({ sphereId }: { sphereId: string }) {
  const sidebarOpen = useChatUIStore((s) => s.sidebarOpen)
  const setSidebarOpen = useChatUIStore((s) => s.setSidebarOpen)

  // Close sidebar when screen grows
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) setSidebarOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [sidebarOpen, setSidebarOpen])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-[calc(100vh-64px)] w-full bg-background text-foreground">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-[300px] shrink-0 border-r border-border">
          <ChatSidebar sphereId={sphereId} />
        </aside>

        {/* Mobile sidebar via Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden m-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[85vw] sm:w-[380px]">
            <ChatSidebar sphereId={sphereId} onSelectThread={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main chat window */}
        <main className="flex-1 min-w-0">
          <ChatWindow sphereId={sphereId} />
        </main>
      </div>
    </QueryClientProvider>
  )
}

