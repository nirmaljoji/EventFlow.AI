"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <main className={"flex-1"}>{children}</main>
      </div>
    </div>
  )
}