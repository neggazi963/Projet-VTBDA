"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { vulnerabilityByType, projectVulnerabilities, vulnerabilityTrends } from "@/lib/mock-data"
import { FileText, Download, Calendar, TrendingDown, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Rapports & Statistiques</h2>
          <p className="text-sm text-muted-foreground mt-1">Analyse détaillée de la sécurité de vos projets</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40 bg-secondary border-border">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Vulnérabilités corrigées</p>
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">45</p>
            <p className="text-xs text-success mt-1">+23% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Temps moyen correction</p>
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">4.2j</p>
            <p className="text-xs text-success mt-1">-1.3j vs mois dernier</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Nouvelles détections</p>
              <TrendingUp className="w-5 h-5 text-critical" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">28</p>
            <p className="text-xs text-critical mt-1">+5 vs mois dernier</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Score compliance</p>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">87%</p>
            <p className="text-xs text-success mt-1">+4% vs mois dernier</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability by Type */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Vulnérabilités par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vulnerabilityByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {vulnerabilityByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {vulnerabilityByType.map((type) => (
                <div key={type.type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-sm text-muted-foreground">
                    {type.type}: {type.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vulnerability by Project */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Vulnérabilités par projet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectVulnerabilities} layout="vertical">
                  <XAxis type="number" stroke="#666" fontSize={12} />
                  <YAxis type="category" dataKey="project" stroke="#666" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critique" />
                  <Bar dataKey="high" stackId="a" fill="#f97316" name="Élevée" />
                  <Bar dataKey="medium" stackId="a" fill="#eab308" name="Moyenne" />
                  <Bar dataKey="low" stackId="a" fill="#22c55e" name="Faible" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Évolution mensuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vulnerabilityTrends}>
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
                <Line
                  type="monotone"
                  dataKey="critical"
                  name="Critique"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444" }}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  name="Élevée"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: "#f97316" }}
                />
                <Line
                  type="monotone"
                  dataKey="medium"
                  name="Moyenne"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ fill: "#eab308" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Rapports générés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Rapport mensuel - Décembre 2024", date: "01/12/2024", type: "PDF", size: "2.4 MB" },
              { name: "Audit Supply Chain Q4", date: "15/11/2024", type: "PDF", size: "5.1 MB" },
              { name: "Analyse CVE - Semaine 48", date: "02/12/2024", type: "Excel", size: "1.2 MB" },
              { name: "Rapport compliance SOC2", date: "25/11/2024", type: "PDF", size: "3.8 MB" },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.date} • {report.type} • {report.size}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
