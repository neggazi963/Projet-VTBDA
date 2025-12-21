"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { Network, AlertTriangle, Package, ArrowRight, RefreshCw, Shield } from "lucide-react"
import { supplyChainData, vulnerablePackages } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

const riskColors = {
  critical: "bg-critical",
  high: "bg-high",
  medium: "bg-medium",
  low: "bg-low",
}

export function SupplyChainPage() {
  const criticalDeps = vulnerablePackages.filter((p) => p.severity === "critical")

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projets analysés</p>
                <p className="text-3xl font-bold text-foreground mt-1">12</p>
              </div>
              <Network className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dépendances totales</p>
                <p className="text-3xl font-bold text-foreground mt-1">847</p>
              </div>
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points critiques</p>
                <p className="text-3xl font-bold text-critical mt-1">{criticalDeps.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-critical" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score supply-chain</p>
                <p className="text-3xl font-bold text-warning mt-1">68%</p>
              </div>
              <Shield className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dependency Graph Visualization */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Graphe des dépendances</CardTitle>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative h-80 bg-secondary/30 rounded-lg p-4 overflow-hidden">
              {/* Simplified graph visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-xs font-medium text-primary-foreground">App</span>
                  </div>

                  {/* Dependency Nodes */}
                  {supplyChainData.nodes.slice(3, 7).map((node, index) => {
                    const angle = index * 90 * (Math.PI / 180)
                    const radius = 100
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius

                    return (
                      <div
                        key={node.id}
                        className={`absolute w-12 h-12 rounded-full ${riskColors[node.risk]} flex items-center justify-center text-xs font-medium text-white`}
                        style={{
                          left: `calc(50% + ${x}px - 24px)`,
                          top: `calc(50% + ${y}px - 24px)`,
                        }}
                      >
                        {node.label.slice(0, 3)}
                      </div>
                    )
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    {supplyChainData.nodes.slice(3, 7).map((_, index) => {
                      const angle = index * 90 * (Math.PI / 180)
                      const radius = 100
                      const x = Math.cos(angle) * radius + 200
                      const y = Math.sin(angle) * radius + 160

                      return (
                        <line
                          key={index}
                          x1="200"
                          y1="160"
                          x2={x}
                          y2={y}
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-border"
                          strokeDasharray="4"
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-critical" />
                  <span className="text-xs text-muted-foreground">Critique</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-high" />
                  <span className="text-xs text-muted-foreground">Élevé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-low" />
                  <span className="text-xs text-muted-foreground">Faible</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Dependencies */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Points critiques identifiés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalDeps.map((dep) => (
              <div key={dep.id} className="p-4 rounded-lg bg-secondary/50 border border-critical/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{dep.name}</p>
                      <SeverityBadge severity={dep.severity} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Version: {dep.version}</p>
                    <p className="text-sm text-muted-foreground">
                      {dep.cve} • CVSS: {dep.cvss}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dep.affectedProjects.map((project) => (
                        <Badge key={project} variant="outline" className="text-xs border-border text-muted-foreground">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-sm text-success flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Action recommandée: Mettre à jour vers la dernière version
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recommandations DevSecOps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground">Mise à jour des packages</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                6 packages critiques nécessitent une mise à jour immédiate pour corriger des vulnérabilités connues.
              </p>
              <Button size="sm" className="mt-4">
                Voir les détails
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <h4 className="font-medium text-foreground">Réduction des dépendances</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                12 dépendances inutilisées détectées. Leur suppression réduira la surface d'attaque.
              </p>
              <Button size="sm" variant="outline" className="mt-4 bg-transparent">
                Analyser
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <h4 className="font-medium text-foreground">Audit de sécurité</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Planifiez un audit complet de la chaîne d'approvisionnement pour identifier les risques cachés.
              </p>
              <Button size="sm" variant="outline" className="mt-4 bg-transparent">
                Planifier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
