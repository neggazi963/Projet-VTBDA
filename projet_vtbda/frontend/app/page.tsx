"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { OverviewPage } from "@/components/pages/overview-page"
import { DependenciesPage } from "@/components/pages/dependencies-page"
import { AlertsPage } from "@/components/pages/alerts-page"
import { SupplyChainPage } from "@/components/pages/supply-chain-page"
import { ContainersPage } from "@/components/pages/containers-page"
import { ReportsPage } from "@/components/pages/reports-page"

export type PageType = "overview" | "dependencies" | "alerts" | "supply-chain" | "containers" | "reports"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewPage />
      case "dependencies":
        return <DependenciesPage />
      case "alerts":
        return <AlertsPage />
      case "supply-chain":
        return <SupplyChainPage />
      case "containers":
        return <ContainersPage />
      case "reports":
        return <ReportsPage />
      default:
        return <OverviewPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={currentPage} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">{renderPage()}</main>
      </div>
    </div>
  )
}
