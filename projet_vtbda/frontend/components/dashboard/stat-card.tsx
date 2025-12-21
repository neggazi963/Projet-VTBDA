import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  iconColor?: string
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: StatCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-sm",
                  changeType === "positive" && "text-success",
                  changeType === "negative" && "text-critical",
                  changeType === "neutral" && "text-muted-foreground",
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", iconColor || "bg-primary/10")}>
            <Icon className={cn("w-6 h-6", iconColor ? "text-current" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
