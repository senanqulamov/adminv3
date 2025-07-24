"use client"

import { ChevronDown, Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdmin } from "@/components/providers/admin-provider"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function Header() {
  const { currentProject, projects, switchProject, isLoading } = useAdmin()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-[#1f1f1f]/80 backdrop-blur-sm">
      <div className="flex items-center space-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-3 bg-[#171717] hover:bg-[#252525] border border-[#2a2a2a] rounded-2xl px-6 py-3 h-auto text-white smooth-transition shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span className="text-lg font-semibold tracking-tight">{currentProject.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1f1f1f] border-[#2a2a2a] shadow-2xl rounded-2xl p-2">
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => switchProject(project.id)}
                className="text-white hover:bg-[#252525] focus:bg-[#252525] rounded-xl px-4 py-3 smooth-transition"
              >
                <span className="font-medium">{project.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-2xl bg-[#171717] hover:bg-[#252525] border border-[#2a2a2a] smooth-transition shadow-lg"
          onClick={() => router.push("/settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-2xl bg-[#171717] hover:bg-[#252525] border border-[#2a2a2a] relative smooth-transition shadow-lg"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-2xl bg-[#171717] hover:bg-[#252525] border border-[#2a2a2a] smooth-transition shadow-lg"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1f1f1f] border-[#2a2a2a] shadow-2xl rounded-2xl p-2" align="end">
            <DropdownMenuItem className="text-white hover:bg-[#252525] focus:bg-[#252525] rounded-xl px-4 py-3">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#252525] focus:bg-[#252525] rounded-xl px-4 py-3">
              Account
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#252525] focus:bg-[#252525] rounded-xl px-4 py-3">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
