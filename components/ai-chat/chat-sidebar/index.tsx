"use client"

import { CopilotSidebar } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css"

interface ChatSidebarProps {
  children: React.ReactNode
}

export function ChatSidebar({ children }: ChatSidebarProps) {
  return (
    <CopilotSidebar
      labels={{
        title: "EventFlow Assistant",
        initial: "Hi! 👋 How can I help you plan your event today?",
      }}
      className="bg-background border-muted z-50"
    >
      {children}
    </CopilotSidebar>
  )
}