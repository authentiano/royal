import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    id: 1,
    title: "New member added",
    description: "John Doe joined the church",
    time: "2 minutes ago",
    icon: "👥",
  },
  {
    id: 2,
    title: "Tithe recorded",
    description: "50,000 UGX from Mary Williams",
    time: "15 minutes ago",
    icon: "💰",
  },
  {
    id: 3,
    title: "Event created",
    description: "Youth Night scheduled for March 20",
    time: "1 hour ago",
    icon: "📅",
  },
  {
    id: 4,
    title: "Cell meeting completed",
    description: "Downtown Cell weekly meeting",
    time: "3 hours ago",
    icon: "🏠",
  },
  {
    id: 5,
    title: "New department member",
    description: "Peter joined the Choir",
    time: "5 hours ago",
    icon: "🎵",
  },
]

export function RecentActivity() {
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
          {activities.map((activity) => (
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
