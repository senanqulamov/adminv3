"use client"

import { useState } from "react"
import { ChevronDown, Bell, LayoutDashboard, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdmin } from "@/components/providers/admin-provider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { NotificationsModal } from "@/components/modals/notifications-modal"
import { ProfileModal } from "@/components/modals/profile-modal"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { currentProject, projects, switchProject, isLoading, viewMode, setViewMode } = useAdmin()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Mock unread notifications count
  const unreadNotifications = 3

  const getViewModeLabel = () => {
    switch (viewMode) {
      case "dashboard":
        return "Dashboard"
      case "profile":
        return "Profile"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  const getViewModeIcon = () => {
    switch (viewMode) {
      case "dashboard":
        return <LayoutDashboard className="h-4 w-4" />
      case "profile":
        return <User className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      default:
        return <LayoutDashboard className="h-4 w-4" />
    }
  }

  return (
      <>
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-[#0a0a0a] backdrop-blur-sm no-select">
          <div className="flex items-center space-x-4">
            {/* Project Selection */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-3 bg-[#1f1f1f] hover:bg-[#252525] border border-[#2a2a2a] rounded-2xl px-6 py-3 h-auto text-white smooth-transition shadow-lg"
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
                        className="text-foreground hover:bg-accent focus:bg-accent rounded-xl px-4 py-3 smooth-transition"
                    >
                      <span className="font-medium">{project.name}</span>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Selection */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-2 bg-[#1f1f1f] hover:bg-[#252525] border border-[#2a2a2a] rounded-2xl px-4 py-2 h-auto text-white smooth-transition shadow-lg"
                >
                  {getViewModeIcon()}
                  <span className="font-medium">{getViewModeLabel()}</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#1f1f1f] border-[#2a2a2a] shadow-2xl rounded-2xl p-2">
                <DropdownMenuItem
                    onClick={() => setViewMode("dashboard")}
                    className="text-foreground hover:bg-accent focus:bg-accent rounded-xl px-4 py-3 smooth-transition"
                >
                  <LayoutDashboard className="h-4 w-4 mr-3" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setViewMode("profile")}
                    className="text-foreground hover:bg-accent focus:bg-accent rounded-xl px-4 py-3 smooth-transition"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setViewMode("settings")}
                    className="text-foreground hover:bg-accent focus:bg-accent rounded-xl px-4 py-3 smooth-transition"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-3">
            <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-2xl bg-[#1f1f1f] hover:bg-[#252525] border border-[#2a2a2a] relative smooth-transition shadow-lg"
                onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full animate-pulse">
                    {unreadNotifications}
                  </Badge>
              )}
            </Button>
          </div>
        </header>

        <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </>
  )
}
