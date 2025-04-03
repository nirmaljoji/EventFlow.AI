import type { Metadata } from "next"
import EventsView from "@/components/events/events-view"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"


export const metadata: Metadata = {
  title: "Events | EvenFlow.AI",
  description: "Manage all your events with EvenFlow.AI",
}

export default function EventsPage() {
  return (
    <ChatSidebar>
      <div className="relative h-[calc(100vh-4rem)] overflow-auto">
        <EventsView />
      </div>
    </ChatSidebar>
  )
}


