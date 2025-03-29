import type { Metadata } from "next"
import EventPageClient from "./event-page-client"

interface EventPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Event Details | EvenFlow.AI",
}

export default function EventPage({ params }: EventPageProps) {
  return <EventPageClient eventId={params.id} />
}

