"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { membersApi, cellsApi, eventsApi } from "@/lib/api"

interface Activity {
  id: number
  title: string
  description: string
  time: string
  icon: string
}

export function RecentActivity() {
  // Fetch recent data
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

  // Build activity list from real data
  const activities: Activity[] = []

  // Add recent members (last 2)
  if (members && members.length > 0) {
    const recentMembers = members.slice(-2)
    recentMembers.forEach((member: any) => {
      activities.push({
        id: `member-${member.id}`,
        title: "New member added",
        description: `${member.first_name} ${member.last_name} joined`,
        time: new Date(member.joined_date).toLocaleDateString(),
        icon: "👥",
      })
    })
  }

  // Add recent cells (last 2)
  if (cells && cells.length > 0) {
    const recentCells = cells.slice(-2)
    recentCells.forEach((cell: any) => {
      activities.push({
        id: `cell-${cell.id}`,
        title: "New cell created",
        description: `${cell.name} established`,
        time: new Date(cell.date_established).toLocaleDateString(),
        icon: "🏠",
      })
    })
  }

  // Add upcoming events (next 2)
  if (events && events.length > 0) {
    const upcoming = events
      .filter((e: any) => e.status === "scheduled")
      .slice(0, 2)
    upcoming.forEach((event: any) => {
      activities.push({
        id: `event-${event.id}`,
        title: "Upcoming event",
        description: event.name,
        time: new Date(event.start_date).toLocaleDateString(),
        icon: "📅",
      })
    })
  }

  // If no activities, show a message
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates from your church
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity. Start by adding members, cells, or events!
          </p>
        </CardContent>
      </Card>
    )
  }

  // Sort by most recent and take first 5
  const recentActivities = activities.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your church
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{activity.icon}</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
