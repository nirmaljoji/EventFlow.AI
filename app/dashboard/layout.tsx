import type { Metadata } from "next"
import type React from "react"
import { DashboardLayout } from "./layout.client"

export const metadata: Metadata = {
  title: "Dashboard | EvenFlow.AI",
  description: "Manage your events with EvenFlow.AI",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
} 