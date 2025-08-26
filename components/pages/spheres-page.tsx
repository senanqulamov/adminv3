"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Plus, Search, MoreHorizontal, Globe, Shield, Activity, Layers } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { apiClient, Sphere } from "@/lib/api"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import toast from "react-hot-toast"
import { AnalyticsModal } from "@/components/modals/analytics-modal"
import { AddSphereModal } from "@/components/modals/add-sphere-modal"
import { EditSphereModal } from "@/components/modals/edit-sphere-modal"
import { ViewSphereModal } from "@/components/modals/view-sphere-modal"
import { ViewSphereDetailModal } from "@/components/modals/view-sphere-detail-modal"

const statsCards = [
  {
    title: "All Spheres",
    count: "1,024",
    icon: Globe,
    color: "bg-primary/20 text-primary border-primary/30",
    type: "users" as const,
  },
  {
    title: "Types",
    count: "2",
    icon: Layers,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    type: "users" as const,
  },
  {
    title: "Owners",
    count: "512",
    icon: Shield,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    type: "orders" as const,
  },
  {
    title: "Activity",
    count: "3,456",
    icon: Activity,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    type: "audit" as const,
  },
]

interface SpheresPageProps {
  isLoading?: boolean
}

export function SpheresPage({ isLoading: externalLoading = false }: SpheresPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [spheres, setSpheres] = useState<Sphere[]>([])
  const [selectedAnalytics, setSelectedAnalytics] = useState<{
    isOpen: boolean
    type: "users" | "orders" | "translations" | "audit"
    title: string
  }>({ isOpen: false, type: "users", title: "" })

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)
  const [totalSpheres, setTotalSpheres] = useState(0)

  const [showAddSphere, setShowAddSphere] = useState(false)
  const [viewSphere, setViewSphere] = useState<Sphere | null>(null)
  const [editSphere, setEditSphere] = useState<Sphere | null>(null)
  const [viewSphereDetailed, setViewSphereDetailed] = useState<Sphere | null>(null)

  const fetchSpheres = useCallback(async () => {
    setIsLoading(true)
    try {
      let res
      if (searchQuery) {
        res = await apiClient.getSpheres({
          page: currentPage,
          limit: rowsPerPage,
          search: searchQuery,
          type: typeFilter === "all" ? undefined : typeFilter,
          status: statusFilter,
        })
      } else {
        res = await apiClient.getSpheres({
          page: currentPage,
          limit: rowsPerPage,
          type: typeFilter === "all" ? undefined : typeFilter,
          status: statusFilter,
        })
      }

      const mapped = res.data.map((s: any) => ({
        id: s.id?.toString() ?? "",
        name: s.name ?? "",
        description: s.description ?? "",
        type: (s.type ?? (s.isPrivate ? "private" : "public")) as Sphere["type"],
        isPrivate: !!s.isPrivate,
        coreHubId: s.coreHubId ?? "",
        userId: s.userId ?? "",
        icon: s.icon ?? "",
        isActive: !!s.isActive,
        createdAt: s.createdAt ?? "",
        updatedAt: s.updatedAt ?? "",
      })) as Sphere[]

      setSpheres(mapped)
      setTotalSpheres(res.total ?? mapped.length)
    } catch (err) {
      console.error("Error fetching spheres:", err)
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }, [currentPage, searchQuery, typeFilter, statusFilter, rowsPerPage])

  useEffect(() => {
    fetchSpheres()
  }, [fetchSpheres])

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchQuery(searchTerm)
    setIsSearching(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleCardClick = (type: "users" | "orders" | "translations" | "audit", title: string) => {
    setSelectedAnalytics({ isOpen: true, type, title })
  }

  const handleDeleteSphere = async (id: string) => {
    setIsLoading(true)
    try {
      await apiClient.deactivateSphere(id)
      setSpheres((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: false } : s)))
      toast.success("Sphere deactivated")
    } catch (err) {
      console.error("Failed to deactivate sphere:", err)
      toast.error("Failed to deactivate")
    } finally {
      setIsLoading(false)
    }
  }

  const toastStyle = {
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
  }

  const handleCopyId = (sphere: Sphere) => {
    toast.promise(
      navigator.clipboard.writeText(sphere.id),
      {
        loading: "Copying...",
        success: <b style={toastStyle}>ID of {sphere.name} copied!</b>,
        error: <b style={toastStyle}>Could not copy.</b>,
      },
      {
        style: toastStyle,
      }
    )
  }

  const openSphereDetail = async (id: string) => {
    try {
      const res = await apiClient.getSphere(id)
      setViewSphereDetailed((res as any).data as Sphere)
    } catch (e) {
      const existing = spheres.find((s) => s.id === id) || null
      setViewSphereDetailed(existing)
    }
  }

  if (isLoading || externalLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(totalSpheres / rowsPerPage))

  const getPaginationItems = () => {
    const items: (number | "ellipsis")[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
    } else {
      const leftBound = Math.max(2, currentPage - 1)
      const rightBound = Math.min(totalPages - 1, currentPage + 1)

      items.push(1)

      if (leftBound > 2) items.push("ellipsis")
      else if (currentPage === maxVisiblePages) items.push(2)

      for (let i = leftBound; i <= rightBound; i++) items.push(i)

      if (rightBound < totalPages - 1) items.push("ellipsis")
      else if (currentPage === totalPages - (maxVisiblePages - 1)) items.push(totalPages - 1)

      items.push(totalPages)
    }
    return items
  }

  return (
    <>
      <div className="space-y-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Spheres</h1>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl"
            onClick={() => setShowAddSphere(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sphere
          </Button>
        </div>

        <Card className="bg-card-main border-border rounded-3xl p-8 shadow-2xl animate-scale-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">All Spheres</h2>
            <div className="flex items-center space-x-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-background border-border text-foreground rounded-2xl h-12">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-2xl">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-background border-border text-foreground rounded-2xl h-12">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-2xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search spheres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 bg-background border-border text-foreground rounded-2xl w-80 h-12 focus:border-primary/50"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsCards.map((card, index) => (
              <Card
                key={card.title}
                className={`bg-card-main border-border rounded-3xl p-6 hover:bg-accent shadow-lg hover:shadow-xl animate-scale-in cursor-pointer`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleCardClick(card.type, card.title)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium tracking-wide">{card.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2 tracking-tight">{card.count}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${card.color}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="rounded-3xl border border-border overflow-hidden bg-background/50">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-accent/50">
                  <TableHead className="text-muted-foreground font-semibold tracking-wide py-4">#</TableHead>
                  <TableHead className="text-muted-foreground font-semibold tracking-wide py-4">Name</TableHead>
                  <TableHead className="text-muted-foreground font-semibold tracking-wide">Description</TableHead>
                  <TableHead className="text-muted-foreground font-semibold tracking-wide">Type</TableHead>
                  <TableHead className="text-muted-foreground font-semibold tracking-wide">Status</TableHead>
                  <TableHead className="text-muted-foreground font-semibold tracking-wide">Last Updated</TableHead>
                  <TableHead className="text-muted-foreground font-semibold tracking-wide">ID (details)</TableHead>
                  <TableHead className="text-muted-foreground font-semibold tracking-wide w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spheres.map((sphere, index) => {
                  const statusLabel = sphere.isActive ? "Active" : "Inactive"
                  return (
                    <TableRow
                      key={sphere.id}
                      className="border-border hover:bg-accent/50 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-semibold text-foreground py-4">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground py-4">{sphere.name}</TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-[280px]">{sphere.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`rounded-xl px-3 py-1 border ${
                            sphere.type === "public"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }`}
                        >
                          {sphere.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`rounded-xl px-3 py-1 border ${
                            sphere.isActive
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{sphere.updatedAt}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="rounded-xl w-max border bg-gradient-to-r from-green-500/20 to-green-400/10 text-green-500 border-green-500/30 flex items-center gap-2 cursor-pointer px-3 py-1 transition-shadow hover:shadow-md"
                                onClick={() => openSphereDetail(sphere.id)}
                              >
                                <Info className="h-4 w-4 mr-1" />
                                <span className="font-mono text-xs">{sphere.id.slice(0, 6)}...</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="flex items-center gap-2">
                              <span className="font-mono text-xs">{sphere.id}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 p-0 text-green-500 hover:text-green-700"
                                onClick={() => handleCopyId(sphere)}
                              >
                                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                  <path d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1h5A1.5 1.5 0 0 1 12 2.5V4M4 4h8M4 4v8.5A1.5 1.5 0 0 0 5.5 14h5A1.5 1.5 0 0 0 12 12.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </Button>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-card border-border rounded-2xl shadow-2xl" align="end">
                            <DropdownMenuItem
                              className="text-foreground hover:bg-accent rounded-xl"
                              onClick={() => setViewSphere(sphere)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-foreground hover:bg-accent rounded-xl"
                              onClick={() => setEditSphere(sphere)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-accent rounded-xl"
                              onClick={() => handleDeleteSphere(sphere.id)}
                            >
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-6 py-4 bg-background border-t border-border">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * rowsPerPage + 1}–
                {Math.min(currentPage * rowsPerPage, totalSpheres)} of {totalSpheres} spheres
              </div>

              <Pagination className="m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={`${currentPage === 1 ?
                        "text-muted-foreground cursor-not-allowed hover:bg-transparent" :
                        "text-foreground hover:bg-accent cursor-pointer"}`}
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    />
                  </PaginationItem>

                  {getPaginationItems().map((item, i) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis className="text-muted-foreground" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          className={`cursor-pointer ${
                            currentPage === item ?
                              "bg-primary text-primary-foreground hover:bg-primary/90 font-medium" :
                              "text-foreground hover:bg-accent font-normal"
                          }`}
                          isActive={currentPage === item}
                          onClick={() => setCurrentPage(item as number)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      className={`${currentPage >= totalPages ?
                        "text-muted-foreground cursor-not-allowed hover:bg-transparent" :
                        "text-foreground hover:bg-accent cursor-pointer"}`}
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </Card>
      </div>

      <AnalyticsModal
        isOpen={selectedAnalytics.isOpen}
        onClose={() => setSelectedAnalytics({ ...selectedAnalytics, isOpen: false })}
        type={selectedAnalytics.type}
        title={selectedAnalytics.title}
      />

      <AddSphereModal
        isOpen={showAddSphere}
        onCloseAction={() => setShowAddSphere(false)}
        onAddAction={async (payload) => {
          try {
            const res = await apiClient.createSphere(payload)
            const newSphere = (res as any).data as Sphere
            setSpheres((prev) => [
              ...prev,
              {
                id: newSphere.id,
                name: newSphere.name,
                description: newSphere.description,
                type: (newSphere.type ?? (newSphere.isPrivate ? "private" : "public")) as any,
                isPrivate: newSphere.isPrivate,
                coreHubId: newSphere.coreHubId,
                userId: newSphere.userId,
                icon: newSphere.icon,
                isActive: newSphere.isActive,
                createdAt: newSphere.createdAt,
                updatedAt: newSphere.updatedAt,
              },
            ])
            toast.success("Sphere added")
          } catch (e) {
            toast.error("Failed to add sphere")
          }
        }}
      />

      <ViewSphereModal
        isOpen={!!viewSphere}
        onCloseAction={() => setViewSphere(null)}
        sphere={viewSphere}
        onEditAction={(s) => {
          setViewSphere(null)
          setEditSphere(s as any)
        }}
      />

      <EditSphereModal
        isOpen={!!editSphere && !viewSphere}
        onCloseAction={() => setEditSphere(null)}
        sphere={editSphere}
        onEditAction={async (payload) => {
          if (!editSphere) return
          try {
            const res = await apiClient.updateSphere(editSphere.id, payload)
            const updated = (res as any).data as Sphere
            setSpheres((prev) => prev.map((s) => (s.id === editSphere.id ? { ...s, ...updated } : s)))
            setEditSphere(null)
            toast.success("Sphere updated")
          } catch (e) {
            toast.error("Failed to update sphere")
          }
        }}
      />

      <ViewSphereDetailModal
        isOpen={!!viewSphereDetailed}
        onCloseAction={() => setViewSphereDetailed(null)}
        sphere={viewSphereDetailed}
      />
    </>
  )
}
