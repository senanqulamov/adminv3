"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex items-center justify-center">
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full border-2 border-gray-600"></div>
        <div className="absolute inset-0 rounded-full border-2 border-amber-100 border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />
}

export function PageLoader() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-8 w-32" />
        <LoadingSkeleton className="h-10 w-24" />
      </div>

      <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <LoadingSkeleton className="h-6 w-24" />
          <LoadingSkeleton className="h-10 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <LoadingSkeleton className="h-4 w-16" />
                  <LoadingSkeleton className="h-8 w-12" />
                </div>
                <LoadingSkeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
