import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, AuthTokens } from "@/types"

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user, tokens) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      clearError: () => set({ isLoading: false }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Helper to check role permissions
export const hasRole = (allowedRoles: string[], userRole?: string): boolean => {
  if (!userRole) return false

  const roleHierarchy: Record<string, number> = {
    superadmin: 6,
    pastor: 5,
    administrator: 4,
    finance: 3,
    cellleader: 2,
    evangelism: 1,
  }

  // Check if user has any of the allowed roles
  if (allowedRoles.includes(userRole)) return true

  // Check if user has higher role
  const userLevel = roleHierarchy[userRole] || 0
  const minRequiredLevel = Math.min(
    ...allowedRoles.map((role) => roleHierarchy[role] || 0)
  )

  return userLevel >= minRequiredLevel
}

// Check if user can perform action based on role
export const canAccess = (allowedRoles: string[], user?: User | null): boolean => {
  if (!user) return false
  return hasRole(allowedRoles, user.role)
}
