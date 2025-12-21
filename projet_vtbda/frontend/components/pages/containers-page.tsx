"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dockerImages } from "@/lib/mock-data"
import { Container, Shield, AlertTriangle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const statusConfig = {
  secure: { label: "Sécurisé", className: "bg-success/20 text-success border-success/30" },
  "at-risk": { label: "À risque", className: "bg-warning/20 text-warning border-warning/30" },
  vulnerable: { label: "Vulnérable", className: "bg-critical/20 text-critical border-critical/30" },
}

export function ContainersPage() {
  const stats = {
    total: dockerImages.length,
    secure: dockerImages.filter((i) => i.status === "secure").length,
    vulnerable: dockerImages.filter((i) => i.status === "vulnerable").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Images totales</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <Container className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sécurisées</p>
                <p className="text-3xl font-bold text-success mt-1">{stats.secure}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vulnérables</p>
                <p className="text-3xl font-bold text-critical mt-1">{stats.vulnerable}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-critical" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score global</p>
                <p className="text-3xl font-bold text-warning mt-1">75%</p>
              </div>
              <Shield className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Docker Images */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Images Docker</CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <RefreshCw className="w-4 h-4" />
            Scanner toutes
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {dockerImages.map((image) => {
            const totalVulns =
              image.vulnerabilities.critical +
              image.vulnerabilities.high +
              image.vulnerabilities.medium +
              image.vulnerabilities.low
            const criticalPercent = totalVulns > 0 ? (image.vulnerabilities.critical / totalVulns) * 100 : 0
            const config = statusConfig[image.status]

            return (
              <div key={image.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        image.status === "secure"
                          ? "bg-success/10"
                          : image.status === "at-risk"
                            ? "bg-warning/10"
                            : "bg-critical/10"
                      }`}
                    >
                      <Container
                        className={`w-6 h-6 ${
                          image.status === "secure"
                            ? "text-success"
                            : image.status === "at-risk"
                              ? "text-warning"
                              : "text-critical"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{image.name}</p>
                        <Badge variant="outline" className={config.className}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {image.tag} • Base: {image.baseImage}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    {/* Vulnerabilities breakdown */}
                    <div className="flex gap-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-critical">{image.vulnerabilities.critical}</p>
                        <p className="text-xs text-muted-foreground">Critique</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-high">{image.vulnerabilities.high}</p>
                        <p className="text-xs text-muted-foreground">Élevée</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-medium">{image.vulnerabilities.medium}</p>
                        <p className="text-xs text-muted-foreground">Moyenne</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-low">{image.vulnerabilities.low}</p>
                        <p className="text-xs text-muted-foreground">Faible</p>
                      </div>
                    </div>

                    <div className="w-32">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Risque</span>
                        <span>{Math.round(criticalPercent)}%</span>
                      </div>
                      <Progress value={100 - criticalPercent} className="h-2" />
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-foreground">{image.size}</p>
                      <p className="text-xs text-muted-foreground">Scan: {image.lastScan}</p>
                    </div>

                    <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                      Détails
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Bonnes pratiques conteneurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="font-medium text-foreground">Images Alpine utilisées</p>
              </div>
              <p className="text-sm text-muted-foreground">
                3/4 images utilisent des bases Alpine minimales, réduisant la surface d'attaque.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <p className="font-medium text-foreground">Images non signées</p>
              </div>
              <p className="text-sm text-muted-foreground">
                2 images ne sont pas signées. Activez la signature pour garantir l'intégrité.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-critical/10 border border-critical/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-critical" />
                <p className="font-medium text-foreground">User root détecté</p>
              </div>
              <p className="text-sm text-muted-foreground">
                1 conteneur s'exécute en tant que root. Utilisez un utilisateur non-privilégié.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="font-medium text-foreground">Scans automatiques</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Tous les pipelines intègrent un scan de vulnérabilités des images.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
