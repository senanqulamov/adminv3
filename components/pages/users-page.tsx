"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Users, Shield, Activity, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AnalyticsModal } from "@/components/modals/analytics-modal"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { ViewUserModal } from "@/components/modals/view-user-modal"
import { EditUserModal } from "@/components/modals/edit-user-modal"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/lib/api"

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
    const [editUser, setEditUser] = useState<User | null>(null)

    useEffect(() => {
        if (externalLoading) {
            setIsLoading(true)
            const timer = setTimeout(() => {
                setUsers(mockUsers)
                setIsLoading(false)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            const timer = setTimeout(() => {
                setUsers(mockUsers)
                setIsLoading(false)
            }, 600)
            return () => clearTimeout(timer)
        }
    }, [externalLoading])

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    const handleCardClick = (type: "users" | "orders" | "translations" | "audit", title: string) => {
        setSelectedAnalytics({ isOpen: true, type, title })
    }

    const handleDeleteUser = (id: number) => {
        setUsers((prev) => prev.filter((user) => user.id !== id))
    }

    const handleUserUpdated = (updatedUser: User) => {
        console.log(updatedUser)
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
        setEditUser(null)
    }

    if (isLoading || externalLoading) {
        return (
            <div className="tab-loader flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <>
            <div className="space-y-8 animate-slide-up">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight no-select">Users</h1>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl no-select"
                        onClick={() => setShowAddUser(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>

                <Card className="bg-card-light border-border rounded-3xl p-8 shadow-2xl animate-scale-in">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold text-foreground tracking-tight no-select">All Users</h2>
                        <div className="flex items-center space-x-4">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-32 bg-background border-border text-foreground rounded-2xl h-12">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border rounded-2xl">
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Editor">Editor</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
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

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 bg-background border-border text-foreground rounded-2xl w-80 h-12 smooth-transition focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {statsCards.map((card, index) => (
                            <Card
                                key={card.title}
                                className="bg-card-main border-border rounded-3xl p-6 hover:bg-accent smooth-transition shadow-lg hover:shadow-xl animate-scale-in cursor-pointer no-select"
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
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide py-4 no-select">
                                        Name
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide no-select">Email</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide no-select">Role</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide no-select">Status</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide no-select">
                                        Last Login
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-semibold tracking-wide w-12 no-select"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user, index) => (
                                    <TableRow
                                        key={user.id}
                                        className="border-border hover:bg-accent/50 smooth-transition animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <TableCell className="font-semibold text-foreground py-4 allow-select">{user.name}</TableCell>
                                        <TableCell className="text-muted-foreground allow-select">{user.email}</TableCell>
                                        <TableCell className="no-select">
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl px-3 py-1"
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="no-select">
                                            <Badge
                                                variant="secondary"
                                                className={`rounded-xl px-3 py-1 border ${
                                                    user.status === "Active"
                                                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                        : "bg-red-500/20 text-red-400 border-red-500/30"
                                                }`}
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground allow-select">{user.lastLogin}</TableCell>
                                        <TableCell className="no-select">
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
                                ))}
                            </TableBody>
                        </Table>
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

            <EditUserModal
                isOpen={!!editUser}
                onClose={() => setEditUser(null)}
                user={editUser}
                onEdit={handleUserUpdated}
            />
        </>
    )
}
