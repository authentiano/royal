"use client"

import { useAuthStore } from "@/store/auth-store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { authApi } from "@/lib/api"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  user_id: number
  role: string
  exp: number
}

export function useAuth() {
  const { user, tokens, isAuthenticated, isLoading, login, logout } =
    useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("access_token")
      const storedRefresh = localStorage.getItem("refresh_token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedRefresh && storedUser) {
        // Check if access token is still valid
        if (!isTokenExpired(storedToken)) {
          // Token is valid, use stored user
          return
        }

        // Access token expired, try to refresh
        try {
          const response = await authApi.refreshToken(storedRefresh)
          const { access } = response.data

          localStorage.setItem("access_token", access)
          // User will be loaded from stored data
        } catch {
          // Refresh failed, logout
          logout()
          router.push("/login")
        }
      } else {
        // No tokens, redirect to login if not on auth page
        if (!pathname.startsWith("/login")) {
          router.push("/login")
        }
      }
    }

    initAuth()
  }, [])

  const loginWithCredentials = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password)
      const { access, refresh, role, username: userUsername, email, first_name, last_name } =
        response.data

      // Store tokens
      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)

      // Create user object
      const user: User = {
        id: response.data.user_id || 0,
        username: userUsername,
        email,
        first_name,
        last_name,
        role,
      }

      localStorage.setItem("user", JSON.stringify(user))

      // Update store
      login(user, { access, refresh })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      }
    }
  }

  const logoutUser = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    logout()
    // Force redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login: loginWithCredentials,
    logout: logoutUser,
  }
}
