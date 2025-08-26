"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Plus, Search, MoreHorizontal, Users, Shield, Activity, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AnalyticsModal } from "@/components/modals/analytics-modal"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { ViewUserModal } from "@/components/modals/view-user-modal"
import { ViewUserDetailModal } from "@/components/modals/view-user-detail-modal"
import { EditUserModal } from "@/components/modals/edit-user-modal"
import { apiClient, User } from "@/lib/api"
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

const statsCards = [
    {
        title: "All Users",
        count: "2,847",
        icon: Users,
        color: "bg-primary/20 text-primary border-primary/30",
        type: "users" as const,
    },
    {
        title: "Roles",
        count: "12",
        icon: Shield,
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        type: "users" as const,
    },
    {
        title: "Orders",
        count: "1,234",
        icon: FileText,
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        type: "orders" as const,
    },
    {
        title: "Audit Log",
        count: "5,678",
        icon: Activity,
        color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        type: "audit" as const,
    },
]

interface UsersPageProps {
    isLoading?: boolean
}

export function UsersPage({ isLoading: externalLoading = false }: UsersPageProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [selectedAnalytics, setSelectedAnalytics] = useState<{
        isOpen: boolean
        type: "users" | "orders" | "translations" | "audit"
        title: string
    }>({ isOpen: false, type: "users", title: "" })
    const [showAddUser, setShowAddUser] = useState(false)
    const [viewUser, setViewUser] = useState<User | null>(null)
    const [viewUserDetailed, setViewUserDetailed] = useState<User | null>(null)

    const [editUser, setEditUser] = useState<User | null>(null)
    const [searchQuery, setSearchQuery] = useState("") // Separate state for actual search query
    const [isSearching, setIsSearching] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage] = useState(10)
    const [totalUsers, setTotalUsers] = useState(0)

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        try {
            let res;
            if (searchQuery) {
                res = await apiClient.searchUsersByKeyword(searchQuery)
            } else {
                res = await apiClient.getUsers({
                    page: currentPage,
                    limit: rowsPerPage,
                    role: roleFilter,
                    status: statusFilter
                })
            }
            const mappedUsers = res.data.map((u: any) => ({
                id: u.id?.toString() ?? "",
                name: u.name ?? "",
                surname: u.surname ?? "",
                nick: u.nick ?? "",
                title: u.title ?? "",
                email: u.email ?? "",
                bio: u.bio ?? "",
                role: u.isAdmin ? "Admin" : "User",
                isVerified: !!u.isVerified,
                isActive: u.isActive ?? false,
                lastLogin: u.updatedAt ?? "",
                karmaPoints: u.karmaPoints ?? 0,
                karmaQuants: u.karmaQuants ?? 0,
                profilePicture: u.profilePicture ?? undefined,
                createdAt: u.createdAt ?? "",
                isAdmin: !!u.isAdmin,
                updatedAt: u.updatedAt ?? "",
            }))
            setUsers(mappedUsers)
            setTotalUsers(res.total ?? mappedUsers.length)
        } catch (err) {
            console.error("Error fetching users:", err)
        } finally {
            setIsLoading(false)
            setIsSearching(false)
        }
    }, [currentPage, searchQuery, roleFilter, statusFilter, rowsPerPage])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleSearch = () => {
        setCurrentPage(1)
        setSearchQuery(searchTerm)
        setIsSearching(true)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleCardClick = (type: "users" | "orders" | "translations" | "audit", title: string) => {
        setSelectedAnalytics({ isOpen: true, type, title })
    }

    const handleDeleteUser = async (id: string) => {
        setIsLoading(true)
        try {
            await apiClient.deleteUser(id)
            setUsers((prev) => prev.filter((user) => user.id !== id))
            setTotalUsers((prev) => prev - 1)
        } catch (err) {
            console.error("Failed to delete user:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUserUpdated = (updatedUser: User) => {
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
        setEditUser(null)
    }

    const toastStyle = {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
    };

    const handleCopyId = (user: User) => {
        toast.promise(
            navigator.clipboard.writeText(user.id),
            {
                loading: 'Copying...',
                success: <b style={toastStyle}>ID of {user.name} copied!</b>,
                error: <b style={toastStyle}>Could not copy.</b>,
            },
            {
                style: toastStyle,
            }
        );
    };

    if (isLoading || externalLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    const totalPages = Math.max(1, Math.ceil(totalUsers / rowsPerPage))

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
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Users</h1>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl"
                        onClick={() => setShowAddUser(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>

                <Card className="bg-card-main border-border rounded-3xl p-8 shadow-2xl animate-scale-in">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold text-foreground tracking-tight">All Users</h2>
                        <div className="flex items-center space-x-4">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-32 bg-background border-border text-foreground rounded-2xl h-12">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border rounded-2xl">
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="1">Admin</SelectItem>
                                    <SelectItem value="0">User</SelectItem>
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
                                    placeholder="Search users..."
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
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide py-4">
                                        #
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide py-4">
                                        Name
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide">Email</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide">Role</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide">Status</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide">
                                        Last Login
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide">
                                        ID (details)
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide w-12">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, index) => {
                                    const statusLabel = user.isVerified ? "Active" : "Inactive"
                                    return (
                                        <TableRow
                                            key={user.id}
                                            className="border-border hover:bg-accent/50 animate-fade-in"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                            // onClick={() => setViewUser(user)}
                                        >
                                            <TableCell className="font-semibold text-foreground py-4">
                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell className="font-semibold text-foreground py-4">{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl px-3 py-1"
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`rounded-xl px-3 py-1 border ${
                                                        user.isVerified
                                                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                            : "bg-red-500/20 text-red-400 border-red-500/30"
                                                    }`}
                                                >
                                                    {statusLabel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge
                                                                variant="secondary"
                                                                className="rounded-xl w-max border bg-gradient-to-r from-green-500/20 to-green-400/10 text-green-500 border-green-500/30 flex items-center gap-2 cursor-pointer px-3 py-1 transition-shadow hover:shadow-md"
                                                                onClick={() => setViewUserDetailed(user)}
                                                            >
                                                                <Info className="h-4 w-4 mr-1" />
                                                                <span className="font-mono text-xs">{user.id.slice(0, 6)}...</span>
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="flex items-center gap-2">
                                                            <span className="font-mono text-xs">{user.id}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5 p-0 text-green-500 hover:text-green-700"
                                                                onClick={() => handleCopyId(user)}
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
                                                            onClick={() => setViewUser(user)}
                                                        >
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-foreground hover:bg-accent rounded-xl"
                                                            onClick={() => setEditUser(user)}
                                                        >
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-400 hover:bg-accent rounded-xl"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            Delete
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
                                {Math.min(currentPage * rowsPerPage, totalUsers)} of {totalUsers} users
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

            <AddUserModal
                isOpen={showAddUser}
                onClose={() => setShowAddUser(false)}
                onAdd={(user) => setUsers((prev) => [...prev, user])}
            />

            <ViewUserModal
                isOpen={!!viewUser}
                onClose={() => setViewUser(null)}
                user={viewUser}
                onEdit={(user) => {
                    setViewUser(null)
                    setEditUser(user)
                }}
            />

            <ViewUserDetailModal
                isOpen={!!viewUserDetailed}
                onClose={() => setViewUserDetailed(null)}
                user={viewUserDetailed}
                onEdit={(user) => {
                    setViewUserDetailed(null)
                    setEditUser(user)
                }}
            />

            <EditUserModal
                isOpen={!!editUser && !viewUser}
                onClose={() => setEditUser(null)}
                user={editUser}
                onEdit={handleUserUpdated}
            />
        </>
    )
}