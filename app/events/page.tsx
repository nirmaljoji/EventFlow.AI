import type { Metadata } from "next"
import EventsView from "@/components/events/events-view"

export const metadata: Metadata = {
  title: "Events | EvenFlow.AI",
  description: "Manage all your events with EvenFlow.AI",
}

export default function EventsPage() {
  return <div className="relative h-[calc(100vh-4rem)] overflow-auto">
            <EventsView />
          </div>
}


