"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "green" | "blue"

interface ThemeSettings {
  theme: Theme
  fontSize: "small" | "medium" | "large"
  sidebarPosition: "left" | "right"
  compactMode: boolean
  animations: boolean
}

interface ThemeContextType {
  settings: ThemeSettings
  updateSettings: (newSettings: Partial<ThemeSettings>) => void
  saveSettings: () => void
}

const defaultSettings: ThemeSettings = {
  theme: "dark",
  fontSize: "medium",
  sidebarPosition: "left",
  compactMode: false,
  animations: true,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("theme-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved theme settings:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = settings.theme

    // Apply font size
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }
    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize]

    // Apply compact mode
    if (settings.compactMode) {
      document.documentElement.classList.add("compact")
    } else {
      document.documentElement.classList.remove("compact")
    }

    // Apply animations
    if (!settings.animations) {
      document.documentElement.classList.add("no-animations")
    } else {
      document.documentElement.classList.remove("no-animations")
    }

    // Save theme to localStorage
    localStorage.setItem("admin-theme", settings.theme)
    document.documentElement.setAttribute("data-theme", settings.theme)

    // Remove all theme classes first
    document.documentElement.classList.remove("light", "dark", "green", "blue")
    // Add the current theme class
    document.documentElement.classList.add(settings.theme)
  }, [settings])

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const saveSettings = () => {
    localStorage.setItem("theme-settings", JSON.stringify(settings))
  }

  return <ThemeContext.Provider value={{ settings, updateSettings, saveSettings }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
