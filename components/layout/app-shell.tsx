import type { ReactNode } from "react"
import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <div className="sticky top-16 h-[calc(100vh-4rem)] hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <AppSidebar />
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

