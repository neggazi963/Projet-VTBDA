"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import type { PageType } from "@/app/page"
import { LayoutDashboard, Package, Bell, Network, Container, FileText, Shield, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const navItems: { id: PageType; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "dependencies", label: "Dépendances", icon: Package },
  { id: "alerts", label: "Alertes", icon: Bell },
  { id: "supply-chain", label: "Supply Chain", icon: Network },
  { id: "containers", label: "Conteneurs", icon: Container },
  { id: "reports", label: "Rapports", icon: FileText },
]

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center w-full")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {isOpen && <span className="font-semibold text-sidebar-foreground">SecWatch</span>}
        </div>
        {isOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                !isOpen && "justify-center px-2",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3 px-3 py-2", !isOpen && "justify-center px-0")}>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">AD</span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@secwatch.io</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
