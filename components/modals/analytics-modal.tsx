"use client"

import { useState, useEffect } from "react"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Calendar, Activity, Download, X } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { apiClient } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
    type: "users" | "orders" | "translations" | "audit"
    title: string
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#F59E0B", "#EF4444", "#8B5CF6"]

export function AnalyticsModal({ isOpen, onClose, type, title }: AnalyticsModalProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true)
            if (type === "users") {
                apiClient.getUsers({ page: 1, limit: 100 })
                    .then(res => {
                        setData({ total: res.total, users: res.data })
                        setIsLoading(false)
                    })
                    .catch(() => setIsLoading(false))
            }
        }
    }, [isOpen, type])

    const handleExport = () => {
        // Export functionality
        const dataStr = JSON.stringify(data, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-analytics.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const renderUsersAnalytics = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card border-border rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Total Users</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.total?.toLocaleString()}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.active?.toLocaleString()}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Growth</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-1">+{data?.growthRate}%</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">New This Month</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.newThisMonth}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">User Activity</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data?.activityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "12px",
                                    color: "hsl(var(--foreground))",
                                }}
                            />
                            <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="bg-card border-border rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Users by Role</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data?.byRole}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                label={({ role, count }) => `${role}: ${count}`}
                            >
                                {data?.byRole?.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    )

    const renderOrdersAnalytics = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.total?.toLocaleString()}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <p className="text-2xl font-bold text-foreground mt-1">${data?.revenue?.toLocaleString()}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.completed}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.pending}</p>
                </Card>
            </div>

            <Card className="bg-card border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "12px",
                                color: "hsl(var(--foreground))",
                            }}
                        />
                        <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )

    const renderTranslationsAnalytics = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Total Keys</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.totalKeys?.toLocaleString()}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.completed}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Languages</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.languages}</p>
                </Card>
                <Card className="bg-card border-border rounded-2xl p-4">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{data?.completionRate}%</p>
                </Card>
            </div>

            <Card className="bg-card border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Completion by Language</h3>
                <div className="space-y-4">
                    {data?.byLanguage?.map((lang: any) => (
                        <div key={lang.language} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-foreground">{lang.language}</span>
                                <span className="text-muted-foreground">
                  {lang.completed}/{lang.total}
                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(lang.completed / lang.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
                <ModalHeader className="border-b border-border pb-4">
                    <div className="flex items-center justify-between">
                        <ModalTitle className="text-2xl text-foreground">{title} Analytics</ModalTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-accent">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </ModalHeader>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <>
                            {type === "users" && renderUsersAnalytics()}
                            {type === "orders" && renderOrdersAnalytics()}
                            {type === "translations" && renderTranslationsAnalytics()}
                            {type === "audit" && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">Audit log analytics coming soon...</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <ModalFooter className="border-t border-border pt-4">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="border-border text-foreground hover:bg-accent rounded-xl bg-transparent"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
