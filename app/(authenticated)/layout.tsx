import type { Metadata } from "next"
import type React from "react"
import { AppShell } from "@/components/layout/app-shell"

export const metadata: Metadata = {
  title: "EvenFlow.AI | Event Planning Platform",
  description: "AI-powered event planning platform",
  generator: 'v0.dev'
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      {children}
    </AppShell>
  )
} 