import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  trend?: string
  trendType?: "positive" | "negative" | "neutral"
  icon?: string
}

export function StatsCard({
  title,
  value,
  trend,
  trendType = "neutral",
  icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <span className="text-2xl">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trendType === "positive" && "text-green-600",
              trendType === "negative" && "text-red-600",
              trendType === "neutral" && "text-muted-foreground"
            )}
          >
            {trend} from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
