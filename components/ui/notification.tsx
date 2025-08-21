import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import * as React from "react"

export type NotificationType = "info" | "success" | "warning" | "error"

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const colors = {
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  success: "bg-green-500/20 text-green-400 border-green-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
}

export interface NotificationProps {
  type?: NotificationType
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
  className?: string
}

export function Notification({
  type = "info",
  title,
  message,
  actionLabel,
  onAction,
  onClose,
  className,
}: NotificationProps) {
  const Icon = icons[type]
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-2xl border shadow-lg animate-fade-in", colors[type], className
      )}
    >
      <div className="pt-1">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        {title && (
          <div className="font-semibold text-foreground mb-1">{title}</div>
        )}
        <div className="text-muted-foreground text-sm">{message}</div>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" className="ml-2 rounded-xl" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {onClose && (
        <Button size="icon" variant="ghost" className="ml-2" onClick={onClose}>
          <XCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

