"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: "📊", roles: ["all"], disabled: false },
  { name: "Members", href: "/members", icon: "👥", roles: ["all"], disabled: false },
  { name: "Cells", href: "/cells", icon: "🏠", roles: ["all"], disabled: false },
  { name: "Departments", href: "/departments", icon: "🏢", roles: ["all"], disabled: true },
  { name: "Events", href: "/events", icon: "📅", roles: ["all"], disabled: true },
  { name: "Finance", href: "/finance", icon: "💰", roles: ["superadmin", "pastor", "administrator", "finance"], disabled: true },
  { name: "Settings", href: "/settings", icon: "⚙️", roles: ["superadmin", "administrator"], disabled: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const canAccess = (roles: string[]) => {
    if (!user) return false
    if (roles.includes("all")) return true
    return roles.includes(user.role)
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">R</span>
            </div>
            <span className="text-lg font-bold">Royal CMS</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation
                  .filter((item) => canAccess(item.roles))
                  .map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        {item.disabled ? (
                          <div
                            className={cn(
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-not-allowed opacity-50",
                              "text-muted-foreground"
                            )}
                            title="Coming soon"
                          >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                            <span className="ml-auto text-xs">🚧</span>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                          </Link>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
