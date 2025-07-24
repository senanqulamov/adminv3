"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ShoppingCart, DollarSign, TrendingUp, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLoader } from "@/components/ui/loading-spinner"

const statsCards = [
  {
    title: "Total Orders",
    count: "3,247",
    icon: ShoppingCart,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    title: "Revenue",
    count: "$124,567",
    icon: DollarSign,
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    title: "Growth",
    count: "+12.5%",
    icon: TrendingUp,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  { title: "Pending", count: "23", icon: Clock, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
]

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    product: "Premium Plan",
    amount: "$99.00",
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    product: "Basic Plan",
    amount: "$29.00",
    status: "Pending",
    date: "2024-01-15",
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    product: "Enterprise Plan",
    amount: "$299.00",
    status: "Processing",
    date: "2024-01-14",
  },
  {
    id: "#ORD-004",
    customer: "Sarah Wilson",
    product: "Premium Plan",
    amount: "$99.00",
    status: "Completed",
    date: "2024-01-14",
  },
]

export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
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
        <h1 className="text-3xl font-bold text-white tracking-tight">Orders</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white tracking-tight">Order Management</h2>
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
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
                <TableHead className="text-gray-400 font-semibold tracking-wide py-4">Order ID</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Customer</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Product</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Amount</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Status</TableHead>
                <TableHead className="text-gray-400 font-semibold tracking-wide">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className="border-[#2a2a2a] hover:bg-[#252525]/50 smooth-transition animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-semibold text-white font-mono py-4">{order.id}</TableCell>
                  <TableCell className="text-gray-300">{order.customer}</TableCell>
                  <TableCell className="text-gray-300">{order.product}</TableCell>
                  <TableCell className="text-white font-semibold">{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-xl px-3 py-1 border ${
                        order.status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : order.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
