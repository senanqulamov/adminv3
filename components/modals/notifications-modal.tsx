"use client"

import {useState, useEffect} from "react"
import {Modal, ModalContent, ModalHeader, ModalTitle} from "@/components/ui/modal"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle} from "lucide-react"
import {mockNotifications} from "@/lib/mock-data"
import type {Notification} from "@/lib/api"

interface NotificationsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function NotificationsModal({isOpen, onClose}: NotificationsModalProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true)
            // Simulate API call
            setTimeout(() => {
                setNotifications(mockNotifications)
                setIsLoading(false)
            }, 500)
        }
    }, [isOpen])

    const markAsRead = (id: number) => {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? {...notif, read: true} : notif)))
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notif) => ({...notif, read: true})))
    }

    const getNotificationIcon = (type: Notification["type"]) => {
        switch (type) {
            case "info":
                return <Info className="h-4 w-4 text-blue-400"/>
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-400"/>
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-400"/>
            case "error":
                return <XCircle className="h-4 w-4 text-red-400"/>
            default:
                return <Bell className="h-4 w-4 text-gray-400"/>
        }
    }

    const getNotificationBadgeColor = (type: Notification["type"]) => {
        switch (type) {
            case "info":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "success":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "warning":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            case "error":
                return "bg-red-500/20 text-red-400 border-red-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="max-w-2xl max-h-[80vh]">
                <ModalHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <ModalTitle className="text-xl">Notifications</ModalTitle>
                            {unreadCount > 0 && (
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-xl">{unreadCount} new</Badge>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-xl bg-transparent"
                            >
                                <CheckCheck className="h-4 w-4 mr-2"/>
                                Mark all read
                            </Button>
                        )}
                    </div>
                </ModalHeader>

                <ScrollArea className="max-h-[60vh] mt-4 mb-4 p-6">
                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                <p className="text-gray-400">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-2xl border transition-all duration-200 hover:bg-[#252525]/50 cursor-pointer ${
                                        notification.read
                                            ? "bg-[#171717] border-[#2a2a2a]"
                                            : "bg-[#1f1f1f] border-[#2a2a2a] ring-1 ring-blue-500/20"
                                    }`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-semibold text-white truncate">{notification.title}</h4>
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-xs rounded-lg ${getNotificationBadgeColor(notification.type)}`}
                                                    >
                                                        {notification.type}
                                                    </Badge>
                                                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                                            <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                                                {notification.actionUrl && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg h-auto py-1 px-2"
                                                    >
                                                        View
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </ModalContent>
        </Modal>
    )
}
