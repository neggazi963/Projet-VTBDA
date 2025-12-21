"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { vulnerabilityTrends, alerts, pipelineHistory } from "@/lib/mock-data"
import { Shield, AlertTriangle, Package, GitBranch, CheckCircle, XCircle, Clock } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { StatusBadge } from "@/components/dashboard/status-badge"

export function OverviewPage() {
  const securityScore = 72

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vulnérabilités totales"
          value={156}
          change="-12% vs mois dernier"
          changeType="positive"
          icon={AlertTriangle}
          iconColor="bg-critical/10 text-critical"
        />
        <StatCard
          title="Dépendances à risque"
          value={23}
          change="+3 cette semaine"
          changeType="negative"
          icon={Package}
          iconColor="bg-high/10 text-high"
        />
        <StatCard
          title="Pipelines sécurisés"
          value="94%"
          change="+2% vs semaine dernière"
          changeType="positive"
          icon={GitBranch}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Alertes actives"
          value={5}
          change="3 critiques"
          changeType="negative"
          icon={Shield}
          iconColor="bg-warning/10 text-warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vulnerability Trends */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Évolution des vulnérabilités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vulnerabilityTrends}>
                  <defs>
                    <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mediumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="critical" name="Critique" stroke="#ef4444" fill="url(#criticalGrad)" />
                  <Area type="monotone" dataKey="high" name="Élevée" stroke="#f97316" fill="url(#highGrad)" />
                  <Area type="monotone" dataKey="medium" name="Moyenne" stroke="#eab308" fill="url(#mediumGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Security Score */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Score de sécurité</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${securityScore * 4.4} 440`}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{securityScore}</span>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">Score global</p>
            <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center">
              <div>
                <p className="text-2xl font-semibold text-success">45</p>
                <p className="text-xs text-muted-foreground">Résolu</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-warning">28</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-critical">12</p>
                <p className="text-xs text-muted-foreground">Non traité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Alertes récentes</CardTitle>
            <span className="text-sm text-muted-foreground">Voir tout →</span>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="mt-0.5">
                  {alert.severity === "critical" ? (
                    <XCircle className="w-5 h-5 text-critical" />
                  ) : alert.severity === "high" ? (
                    <AlertTriangle className="w-5 h-5 text-high" />
                  ) : (
                    <Clock className="w-5 h-5 text-medium" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pipeline Status */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Pipelines récents</CardTitle>
            <span className="text-sm text-muted-foreground">Voir tout →</span>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineHistory.slice(0, 4).map((pipeline) => (
              <div
                key={pipeline.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div>
                  {pipeline.status === "success" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : pipeline.status === "failed" ? (
                    <XCircle className="w-5 h-5 text-critical" />
                  ) : pipeline.status === "running" ? (
                    <div className="w-5 h-5 rounded-full border-2 border-chart-2 border-t-transparent animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5 text-medium" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{pipeline.name}</p>
                    <StatusBadge status={pipeline.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pipeline.branch} • {pipeline.commit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{pipeline.duration}</p>
                  <p className="text-xs text-muted-foreground">{pipeline.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
