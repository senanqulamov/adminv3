// API configuration and base functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adminv3-b4gqe6epctd5gnad.canadacentral-01.azurewebsites.net"

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  error: boolean
  total?: number
}

export interface User {
  id: string
  name: string
  email: string
  bio: string
  role: string
  karmaPoints?: number
  karmaQuants?: number
  createdAt: string
  updatedAt: string
  isAdmin: boolean
  profilePicture?: string | null
  isVerified: boolean
  lastLogin?: string
}

export interface Translation {
  id: number
  key: string
  en: string
  es: string
  fr: string
  status: "Complete" | "Incomplete"
  lastModified: string
  category: string
}

export interface Order {
  id: string
  customer: string
  product: string
  amount: string
  status: "Completed" | "Pending" | "Processing" | "Cancelled"
  date: string
  items: number
  paymentMethod: string
}

export interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface Analytics {
  users: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
    growthRate: number
    byRole: { role: string; count: number }[]
    activityData: { date: string; count: number }[]
  }
  orders: {
    total: number
    completed: number
    pending: number
    revenue: number
    growthRate: number
    recentOrders: Order[]
    revenueData: { date: string; amount: number }[]
  }
  translations: {
    totalKeys: number
    completed: number
    incomplete: number
    languages: number
    completionRate: number
    byLanguage: { language: string; completed: number; total: number }[]
  }
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      ...options,
    })

    if (!response.ok) {
      let errorMsg = `API Error: ${response.statusText}`
      try {
        const errorJson = await response.json()
        errorMsg += ` - ${errorJson?.message ?? ""}`
      } catch { }
      throw new Error(errorMsg)
    }

    return response.json()
  }

  // Users API
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.role) searchParams.append("role", params.role)
    if (params?.status) searchParams.append("status", params.status)

    return this.request<User[]>(`/auth/users?${searchParams}`)
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">) {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  }

  async updateUser(id: string, user: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Translations API
  async getTranslations(params?: {
    page?: number
    limit?: number
    search?: string
    language?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.language) searchParams.append("language", params.language)
    if (params?.status) searchParams.append("status", params.status)

    return this.request<Translation[]>(`/translations?${searchParams}`)
  }

  async createTranslation(translation: Omit<Translation, "id" | "lastModified">) {
    return this.request<Translation>("/translations", {
      method: "POST",
      body: JSON.stringify(translation),
    })
  }

  async updateTranslation(id: number, translation: Partial<Translation>) {
    return this.request<Translation>(`/translations/${id}`, {
      method: "PUT",
      body: JSON.stringify(translation),
    })
  }

  async autoTranslate(key: string, sourceLanguage: string, targetLanguages: string[]) {
    return this.request<Translation>("/translations/auto-translate", {
      method: "POST",
      body: JSON.stringify({ key, sourceLanguage, targetLanguages }),
    })
  }

  // Orders API
  async getOrders(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.status) searchParams.append("status", params.status)

    return this.request<Order[]>(`/orders?${searchParams}`)
  }

  async createOrder(order: Omit<Order, "id" | "date">) {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    })
  }

  async updateOrderStatus(id: string, status: Order["status"]) {
    return this.request<Order>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  // Notifications API
  async getNotifications() {
    return this.request<Notification[]>("/notifications")
  }

  async markNotificationRead(id: number) {
    return this.request<void>(`/notifications/${id}/read`, {
      method: "PUT",
    })
  }

  async markAllNotificationsRead() {
    return this.request<void>("/notifications/read-all", {
      method: "PUT",
    })
  }

  // Analytics API
  async getAnalytics() {
    return this.request<Analytics>("/analytics")
  }

  async getUserAnalytics() {
    return this.request<Analytics["users"]>("/analytics/users")
  }

  async getOrderAnalytics() {
    return this.request<Analytics["orders"]>("/analytics/orders")
  }

  async getTranslationAnalytics() {
    return this.request<Analytics["translations"]>("/analytics/translations")
  }
}

export const apiClient = new ApiClient()