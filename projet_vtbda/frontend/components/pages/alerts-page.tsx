"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { alerts } from "@/lib/mock-data"
import {
  Bell,
  AlertTriangle,
  Package,
  GitBranch,
  Container,
  Settings,
  CheckCircle,
  XCircle,
  Filter,
  MoreVertical,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const alertTypeIcons: Record<string, React.ElementType> = {
  vulnerability: AlertTriangle,
  pipeline: GitBranch,
  "supply-chain": Package,
  container: Container,
  configuration: Settings,
}

export function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    return matchesSeverity && matchesType
  })

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    actionRequired: alerts.filter((a) => a.actionRequired).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertes totales</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critiques</p>
                <p className="text-3xl font-bold text-critical mt-1">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-critical" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actions requises</p>
                <p className="text-3xl font-bold text-warning mt-1">{stats.actionRequired}</p>
              </div>
              <XCircle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-foreground">Toutes les alertes</CardTitle>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32 bg-secondary border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sévérité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-secondary border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="vulnerability">Vulnérabilité</SelectItem>
                  <SelectItem value="pipeline">Pipeline</SelectItem>
                  <SelectItem value="supply-chain">Supply Chain</SelectItem>
                  <SelectItem value="container">Conteneur</SelectItem>
                  <SelectItem value="configuration">Configuration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-secondary mb-4">
              <TabsTrigger value="active">
                Actives ({filteredAlerts.filter((a) => a.actionRequired).length})
              </TabsTrigger>
              <TabsTrigger value="resolved">Résolues</TabsTrigger>
              <TabsTrigger value="all">Toutes</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-3">
              {filteredAlerts
                .filter((a) => a.actionRequired)
                .map((alert) => {
                  const Icon = alertTypeIcons[alert.type] || AlertTriangle
                  return (
                    <div
                      key={alert.id}
                      className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border-l-4 border-l-critical"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-critical/10">
                            <Icon className="w-5 h-5 text-critical" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-foreground">{alert.title}</p>
                              <SeverityBadge severity={alert.severity} />
                              <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                                {alert.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Projet: {alert.project}</span>
                              <span>{alert.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="default">
                            Corriger
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                              <DropdownMenuItem>Marquer comme résolu</DropdownMenuItem>
                              <DropdownMenuItem>Ignorer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </TabsContent>
            <TabsContent value="resolved" className="space-y-3">
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune alerte résolue récemment</p>
              </div>
            </TabsContent>
            <TabsContent value="all" className="space-y-3">
              {filteredAlerts.map((alert) => {
                const Icon = alertTypeIcons[alert.type] || AlertTriangle
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border-l-4 ${
                      alert.severity === "critical"
                        ? "border-l-critical"
                        : alert.severity === "high"
                          ? "border-l-high"
                          : "border-l-medium"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            alert.severity === "critical"
                              ? "bg-critical/10"
                              : alert.severity === "high"
                                ? "bg-high/10"
                                : "bg-medium/10"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              alert.severity === "critical"
                                ? "text-critical"
                                : alert.severity === "high"
                                  ? "text-high"
                                  : "text-medium"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-foreground">{alert.title}</p>
                            <SeverityBadge severity={alert.severity} />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
