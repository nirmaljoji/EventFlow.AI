import type { Metadata } from "next"
import EventsView from "@/components/events/events-view"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"


export const metadata: Metadata = {
  title: "Events | EvenFlow.AI",
  description: "Manage all your events with EvenFlow.AI",
}

export default function EventsPage() {
  return (
    // Apply height constraint to the container of ChatSidebar
    <div className="h-[calc(100vh-4rem)]">
      <ChatSidebar>
        {/* This div now takes full height relative to its ResizablePanel parent */}
        <div className="relative h-full overflow-auto">
          <EventsView />
        </div>
      </ChatSidebar>
    </div>
  )
}


