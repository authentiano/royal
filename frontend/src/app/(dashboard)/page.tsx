"use client"

import { useQuery } from "@tanstack/react-query"
import { membersApi, cellsApi, eventsApi, financeApi } from "@/lib/api"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function HomePage() {
  // Fetch real data from backend
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await membersApi.getAll()
      return response.data
    },
  })

  const { data: cells } = useQuery({
    queryKey: ["cells"],
    queryFn: async () => {
      const response = await cellsApi.getAll()
      return response.data
    },
  })

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await eventsApi.getAll()
      return response.data
    },
  })

  const { data: financeSummary } = useQuery({
    queryKey: ["finance-summary"],
    queryFn: async () => {
      const response = await financeApi.getSummary()
      return response.data
    },
  })

  // Calculate stats
  const totalMembers = members?.length || 0
  const activeCells = cells?.filter((c: any) => c.status === "active").length || 0
  const upcomingEvents = events?.filter((e: any) => e.status === "scheduled").length || 0
  const monthlyTithe = financeSummary?.total_income 
    ? `${(financeSummary.total_income / 1000000).toFixed(1)}M UGX`
    : "0 UGX"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Royal CMS - Church Management System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Members"
          value={totalMembers}
          trend={totalMembers > 0 ? "Active members" : "No members yet"}
          trendType={totalMembers > 0 ? "positive" : "neutral"}
          icon="👥"
        />
        <StatsCard
          title="Active Cells"
          value={activeCells}
          trend={activeCells > 0 ? "Active groups" : "No active cells"}
          trendType={activeCells > 0 ? "positive" : "neutral"}
          icon="🏠"
        />
        <StatsCard
          title="Monthly Income"
          value={monthlyTithe}
          trend="Total income"
          trendType="positive"
          icon="💰"
        />
        <StatsCard
          title="Upcoming Events"
          value={upcomingEvents}
          trend="Scheduled events"
          trendType="neutral"
          icon="📅"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
      </div>
    </div>
  )
}
