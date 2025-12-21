import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "success" | "failed" | "pending" | "running"

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  success: { label: "Succès", className: "bg-success/20 text-success border-success/30" },
  failed: { label: "Échec", className: "bg-critical/20 text-critical border-critical/30" },
  pending: { label: "En attente", className: "bg-medium/20 text-medium border-medium/30" },
  running: { label: "En cours", className: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
