"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your church management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Members"
          value="1,234"
          trend="+12%"
          trendType="positive"
          icon="👥"
        />
        <StatsCard
          title="Active Cells"
          value="24"
          trend="+2"
          trendType="positive"
          icon="🏠"
        />
        <StatsCard
          title="Departments"
          value="8"
          trend="0"
          trendType="neutral"
          icon="🏢"
        />
        <StatsCard
          title="Events This Month"
          value="12"
          trend="+3"
          trendType="positive"
          icon="📅"
        />
      </div>

      {/* Finance Summary (only for finance roles) */}
      {(user?.role === "superadmin" ||
        user?.role === "pastor" ||
        user?.role === "administrator" ||
        user?.role === "finance") && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Income (This Month)"
            value="2,500,000 UGX"
            trend="+15%"
            trendType="positive"
            icon="💰"
          />
          <StatsCard
            title="Expenses (This Month)"
            value="800,000 UGX"
            trend="-5%"
            trendType="positive"
            icon="💸"
          />
          <StatsCard
            title="Balance"
            value="1,700,000 UGX"
            trend="+10%"
            trendType="positive"
            icon="📈"
          />
        </div>
      )}

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
