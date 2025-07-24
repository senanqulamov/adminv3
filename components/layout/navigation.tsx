"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const navigationItems = [
  { name: "Users", path: "/" },
  { name: "Translations", path: "/translations" },
  { name: "Orders", path: "/orders" },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState(pathname)

  const handleNavigation = (path: string) => {
    if (path === pathname) return

    setActiveTab(path)
    startTransition(() => {
      router.push(path)
    })
  }

  return (
    <nav className="px-6 py-4 border-b border-[#2a2a2a] bg-[#1f1f1f]/50 backdrop-blur-sm">
      <div className="flex space-x-2">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            onClick={() => handleNavigation(item.path)}
            disabled={isPending}
            className={`px-8 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 smooth-transition ${
              pathname === item.path
                ? "bg-[#171717] text-white border border-[#2a2a2a] shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-[#252525]/50"
            }`}
          >
            {isPending && activeTab === item.path ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>{item.name}</span>
              </div>
            ) : (
              item.name
            )}
          </Button>
        ))}
      </div>
    </nav>
  )
}
