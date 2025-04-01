"use client"

import DashboardView from "@/components/dashboard/dashboard-view"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"

export default function DashboardPage() {
  return (
    <ChatSidebar>
      <DashboardView />
    </ChatSidebar>
  )
}



