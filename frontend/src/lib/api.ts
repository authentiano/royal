import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          throw new Error("No refresh token")
        }

        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem("access_token", access)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API calls
export const authApi = {
  login: (username: string, password: string) =>
    api.post("/auth/token/", { username, password }),

  refreshToken: (refresh: string) =>
    api.post("/auth/token/refresh/", { refresh }),
}

// Members API
export const membersApi = {
  getAll: (params?: Record<string, string>) =>
    api.get("/members/members/", { params }),
  getById: (id: number) => api.get(`/members/members/${id}/`),
  create: (data: any) => api.post("/members/members/", data),
  update: (id: number, data: any) =>
    api.patch(`/members/members/${id}/`, data),
  delete: (id: number) => api.delete(`/members/members/${id}/`),
}

// Cells API
export const cellsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get("/cells/", { params }),
  getById: (id: number) => api.get(`/cells/${id}/`),
  create: (data: any) => api.post("/cells/", data),
  update: (id: number, data: any) => api.patch(`/cells/${id}/`, data),
  delete: (id: number) => api.delete(`/cells/${id}/`),
  getMembers: (id: number) => api.get(`/cells/${id}/members/`),
  addMember: (id: number, memberId: number) =>
    api.post(`/cells/${id}/add_member/`, { member_id: memberId }),
  removeMember: (id: number, memberId: number) =>
    api.post(`/cells/${id}/remove_member/`, { member_id: memberId }),
}

// Departments API
export const departmentsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get("/departments/", { params }),
  getById: (id: number) => api.get(`/departments/${id}/`),
  create: (data: any) => api.post("/departments/", data),
  update: (id: number, data: any) => api.patch(`/departments/${id}/`, data),
  delete: (id: number) => api.delete(`/departments/${id}/`),
  getMembers: (id: number) => api.get(`/departments/${id}/members/`),
  addMember: (id: number, memberId: number, role = "member") =>
    api.post(`/departments/${id}/add_member/`, { member_id: memberId, role }),
  removeMember: (id: number, memberId: number) =>
    api.post(`/departments/${id}/remove_member/`, { member_id: memberId }),
}

// Events API
export const eventsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get("/events/", { params }),
  getById: (id: number) => api.get(`/events/${id}/`),
  create: (data: any) => api.post("/events/", data),
  update: (id: number, data: any) => api.patch(`/events/${id}/`, data),
  delete: (id: number) => api.delete(`/events/${id}/`),
  getAttendance: (id: number) => api.get(`/events/${id}/attendance/`),
  markAttendance: (id: number, memberId: number, status = "present") =>
    api.post(`/events/${id}/mark_attendance/`, { member_id: memberId, status }),
  bulkMarkAttendance: (id: number, members: Array<{ member_id: number; status: string }>) =>
    api.post(`/events/${id}/bulk_mark_attendance/`, { members }),
}

// Finance API
export const financeApi = {
  // Transactions
  getTransactions: (params?: Record<string, string>) =>
    api.get("/finance/transactions/", { params }),
  createTransaction: (data: any) =>
    api.post("/finance/transactions/", data),
  approveTransaction: (id: number) =>
    api.post(`/finance/transactions/${id}/approve/`),
  rejectTransaction: (id: number) =>
    api.post(`/finance/transactions/${id}/reject/`),
  getSummary: () => api.get("/finance/transactions/summary/"),

  // Categories
  getCategories: () => api.get("/finance/categories/"),
  createCategory: (data: any) =>
    api.post("/finance/categories/", data),

  // Budgets
  getBudgets: (params?: Record<string, string>) =>
    api.get("/finance/budgets/", { params }),
  createBudget: (data: any) => api.post("/finance/budgets/", data),

  // Expense Claims
  getExpenseClaims: (params?: Record<string, string>) =>
    api.get("/finance/expense-claims/", { params }),
  createExpenseClaim: (data: any) =>
    api.post("/finance/expense-claims/", data),
  submitExpenseClaim: (id: number) =>
    api.post(`/finance/expense-claims/${id}/submit/`),
  approveExpenseClaim: (id: number) =>
    api.post(`/finance/expense-claims/${id}/approve/`),
  markExpenseClaimPaid: (id: number) =>
    api.post(`/finance/expense-claims/${id}/mark_paid/`),
}
