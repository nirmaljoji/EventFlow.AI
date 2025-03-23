import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AppShell } from "@/components/layout/app-shell"
import { ThemeProvider } from "@/components/theme-provider"
import { AIChatPanel } from "@/components/ai-chat/ai-chat-panel"
import { AIAssistantIntro } from "@/components/ai-chat/ai-assistant-intro"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EvenFlow.AI | Event Planning Platform",
  description: "AI-powered event planning platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AppShell>{children}</AppShell>
          <AIChatPanel />
          <AIAssistantIntro />
        </ThemeProvider>
      </body>
    </html>
  )
}
