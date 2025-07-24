"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "./header"
import { Navigation } from "./navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#171717] text-white smooth-transition">
      <Header />
      <Navigation />
      <main className="px-6 py-8 animate-slide-up">{children}</main>
    </div>
  )
}
