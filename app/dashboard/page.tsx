"use client"

import DashboardView from "@/components/dashboard/dashboard-view"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"

export default function DashboardPage() {
  return (
    <ChatSidebar>
      <div className="relative h-[calc(100vh-4rem)] overflow-auto">
        <DashboardView />
      </div>
    </ChatSidebar>
  )
}


