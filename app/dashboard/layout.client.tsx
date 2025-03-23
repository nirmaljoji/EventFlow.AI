"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { AppShell } from "@/components/layout/app-shell"
import { ThemeProvider } from "@/components/theme-provider"
import { AIChatPanel } from "@/components/ai-chat/ai-chat-panel"
import { AIAssistantIntro } from "@/components/ai-chat/ai-assistant-intro"

const inter = Inter({ subsets: ["latin"] })

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <AppShell>{children}</AppShell>
        <AIChatPanel />
        <AIAssistantIntro />
      </ThemeProvider>
    </div>
  )
} 