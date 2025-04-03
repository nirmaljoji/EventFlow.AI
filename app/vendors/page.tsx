import type { Metadata } from "next"
import VendorsView from "@/components/vendors/vendors-view"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"

export const metadata: Metadata = {
  title: "Vendors | EvenFlow.AI",
  description: "Browse and manage vendors for your events",
}

export default function VendorsPage() {
  return (
    <ChatSidebar>
      <div className="relative h-[calc(100vh-4rem)] overflow-auto">
        <VendorsView />
      </div>
    </ChatSidebar>
  )
}



