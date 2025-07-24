import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AdminProvider } from "@/components/providers/admin-provider"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Multi-Project Admin Panel",
  description: "Comprehensive admin panel for managing multiple projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={inter.className}>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  )
}
