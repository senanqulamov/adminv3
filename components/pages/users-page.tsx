"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Users, Shield, Activity, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageLoader } from "@/components/ui/loading-spinner"

const statsCards = [
  { title: "All Users", count: "2,847", icon: Users, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { title: "Roles", count: "12", icon: Shield, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { title: "Orders", count: "1,234", icon: FileText, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  {
    title: "Audit Log",
    count: "5,678",
    icon: Activity,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
]

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active", lastLogin: "1 day ago" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Inactive", lastLogin: "1 week ago" },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Editor",
    status: "Active",
    lastLogin: "3 hours ago",
  },
]

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white tracking-tight">All Users</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-[#171717] border-[#2a2a2a] text-white rounded-2xl w-80 h-12 smooth-transition focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((card, index) => (
            <Card
              key={card.title}
              className="bg-[#171717] border-[#2a2a2a] rounded-3xl p-6 hover:bg-[#252525] smooth-transition shadow-lg hover:shadow-xl animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium tracking-wide">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2 tracking-tight">{card.count}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-[#2a2a2a] overflow-hidden bg-[#171717]/50">
          <Table>
            <TableHeader>
              <TableRow className="border-[#2a2a2a] hover:bg-[#252525]/50">
                <TableHead className="text-gray-400 font-semibold tracking-wide py-4">Name</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Email</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Role</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Status</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Last Login</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="border-[#2a2a2a] hover:bg-[#252525]/50 smooth-transition animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-semibold text-white py-4">{user.name}</TableCell>
                  <TableCell className="text-gray-400">{user.email}</TableCell>
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
                        user.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#252525] rounded-xl"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl shadow-2xl" align="end">
                        <DropdownMenuItem className="text-white hover:bg-[#252525] rounded-xl">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-[#252525] rounded-xl">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-[#252525] rounded-xl">
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
  )
}
