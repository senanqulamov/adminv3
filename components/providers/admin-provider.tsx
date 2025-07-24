"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Project {
  id: string
  name: string
  database: string
  apiUrl: string
}

interface AdminContextType {
  currentProject: Project
  projects: Project[]
  switchProject: (projectId: string) => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const defaultProjects: Project[] = [
  {
    id: "neosphere",
    name: "NeoSphere",
    database: "neosphere_db",
    apiUrl: "https://api.neosphere.com",
  },
  {
    id: "techflow",
    name: "TechFlow",
    database: "techflow_db",
    apiUrl: "https://api.techflow.com",
  },
  {
    id: "innovate",
    name: "InnovateHub",
    database: "innovate_db",
    apiUrl: "https://api.innovatehub.com",
  },
]

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project>(defaultProjects[0])
  const [projects] = useState<Project[]>(defaultProjects)
  const [isLoading, setIsLoading] = useState(false)

  const switchProject = async (projectId: string) => {
    setIsLoading(true)
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      // Simulate API call to switch database context
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCurrentProject(project)
      localStorage.setItem("currentProject", projectId)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const savedProject = localStorage.getItem("currentProject")
    if (savedProject) {
      const project = projects.find((p) => p.id === savedProject)
      if (project) {
        setCurrentProject(project)
      }
    }
  }, [projects])

  return (
    <AdminContext.Provider
      value={{
        currentProject,
        projects,
        switchProject,
        isLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
