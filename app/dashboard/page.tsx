"use client"

import DashboardView from "@/components/dashboard/dashboard-view"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"

export default function DashboardPage() {
  return (
    // Apply height constraint to the container of ChatSidebar
    <div className="h-[calc(100vh-4rem)]">
      <ChatSidebar>
        {/* This div now takes full height relative to its ResizablePanel parent */}
        <div className="relative h-full overflow-auto">
          <DashboardView />
        </div>
      </ChatSidebar>
    </div>
  )
}
