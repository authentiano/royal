"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, logout } = useAuth()

  const getRoleDisplay = (role: string) => {
    const roleNames: Record<string, string> = {
      superadmin: "Super Admin",
      pastor: "Pastor",
      administrator: "Administrator",
      finance: "Finance Officer",
      cellleader: "Cell Leader",
      evangelism: "Evangelism Team",
    }
    return roleNames[role] || role
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-lg font-semibold">
            Welcome back, {user?.first_name || user?.username}!
          </h1>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.first_name?.[0] || user?.username?.[0] || "U"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplay(user?.role || "")}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
