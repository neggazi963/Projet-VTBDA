"use client"

import type { PageType } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Search, Bell, Settings, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  currentPage: PageType
  toggleSidebar: () => void
}

const pageTitles: Record<PageType, string> = {
  overview: "Vue d'ensemble",
  dependencies: "Suivi des dépendances",
  alerts: "Alertes & Notifications",
  "supply-chain": "Analyse Supply Chain",
  containers: "Sécurité Conteneurs",
  reports: "Rapports & Statistiques",
}

export function Header({ currentPage, toggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{pageTitles[currentPage]}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="w-64 pl-9 bg-secondary border-border" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              Production
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Production</DropdownMenuItem>
            <DropdownMenuItem>Staging</DropdownMenuItem>
            <DropdownMenuItem>Development</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-critical text-white text-xs">
            3
          </Badge>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
