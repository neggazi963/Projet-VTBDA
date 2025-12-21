import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Severity = "critical" | "high" | "medium" | "low"

interface SeverityBadgeProps {
  severity: Severity
  className?: string
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: { label: "Critique", className: "bg-critical/20 text-critical border-critical/30" },
  high: { label: "Élevée", className: "bg-high/20 text-high border-high/30" },
  medium: { label: "Moyenne", className: "bg-medium/20 text-medium border-medium/30" },
  low: { label: "Faible", className: "bg-low/20 text-low border-low/30" },
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
