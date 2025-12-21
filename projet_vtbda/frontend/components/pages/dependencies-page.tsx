"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { vulnerablePackages } from "@/lib/mock-data"
import { Search, Filter, ExternalLink, RefreshCw, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DependenciesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [languageFilter, setLanguageFilter] = useState<string>("all")

  const filteredPackages = vulnerablePackages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.cve.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || pkg.severity === severityFilter
    const matchesLanguage = languageFilter === "all" || pkg.language === languageFilter
    return matchesSearch && matchesSeverity && matchesLanguage
  })

  const stats = {
    total: vulnerablePackages.length,
    critical: vulnerablePackages.filter((p) => p.severity === "critical").length,
    high: vulnerablePackages.filter((p) => p.severity === "high").length,
    patchAvailable: vulnerablePackages.filter((p) => p.patchAvailable).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total vulnérables</p>
            <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Critiques</p>
            <p className="text-3xl font-bold text-critical mt-1">{stats.critical}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Élevées</p>
            <p className="text-3xl font-bold text-high mt-1">{stats.high}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Patch disponible</p>
            <p className="text-3xl font-bold text-success mt-1">{stats.patchAvailable}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou CVE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
                <SelectValue placeholder="Langage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Scanner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Dépendances vulnérables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Package</TableHead>
                <TableHead className="text-muted-foreground">Version</TableHead>
                <TableHead className="text-muted-foreground">CVE</TableHead>
                <TableHead className="text-muted-foreground">CVSS</TableHead>
                <TableHead className="text-muted-foreground">Sévérité</TableHead>
                <TableHead className="text-muted-foreground">Langage</TableHead>
                <TableHead className="text-muted-foreground">Projets affectés</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id} className="border-border hover:bg-secondary/50">
                  <TableCell className="font-medium text-foreground">{pkg.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{pkg.version}</TableCell>
                  <TableCell>
                    <a href="#" className="text-primary hover:underline flex items-center gap-1">
                      {pkg.cve}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${pkg.cvss >= 9 ? "text-critical" : pkg.cvss >= 7 ? "text-high" : "text-medium"}`}
                    >
                      {pkg.cvss}
                    </span>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={pkg.severity} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-muted-foreground border-border">
                      {pkg.language}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{pkg.affectedProjects.length} projet(s)</TableCell>
                  <TableCell>
                    {pkg.patchAvailable ? (
                      <Button size="sm" className="gap-1 bg-success hover:bg-success/90 text-success-foreground">
                        <CheckCircle className="w-3 h-3" />
                        Mettre à jour
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Pas de patch
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
