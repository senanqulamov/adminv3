"use client"

import type React from "react"
import { Header } from "./header"
import { Navigation } from "./navigation"
import { ProfilePage } from "@/components/pages/profile-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { useAdmin } from "@/components/providers/admin-provider"
import { usePathname } from "next/navigation"
import { Toaster } from "react-hot-toast"

interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { viewMode } = useAdmin()
    const pathname = usePathname()
    const isDashboard = pathname === "/" || pathname === "/translations" || pathname === "/orders"

    const renderContent = () => {
        switch (viewMode) {
            case "profile":
                return <ProfilePage />
            case "settings":
                return <SettingsPage />
            case "dashboard":
            default:
                return (
                    <>
                        {isDashboard && <Navigation />}
                        <main className="container mx-auto px-6 py-8">{children}</main>
                    </>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header />
            {renderContent()}
            <Toaster position="top-center" />
        </div>
    )
}
