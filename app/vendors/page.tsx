import type { Metadata } from "next"
import VendorsView from "@/components/vendors/vendors-view"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"

export const metadata: Metadata = {
  title: "Vendors | EvenFlow.AI",
  description: "Browse and manage vendors for your events",
}

export default function VendorsPage() {
  return (
    // Apply height constraint to the container of ChatSidebar
    <div className="h-[calc(100vh-4rem)]">
      <ChatSidebar>
        {/* This div now takes full height relative to its ResizablePanel parent */}
        <div className="relative h-full overflow-auto">
          <VendorsView />
        </div>
      </ChatSidebar>
    </div>
  )
}



