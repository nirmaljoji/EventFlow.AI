import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { mockEvents } from "@/lib/mock-data"
import EventPageClient from "./event-page-client"

interface EventPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = mockEvents.find((event) => event.id === params.id)

  if (!event) {
    return {
      title: "Event Not Found",
    }
  }

  return {
    title: `${event.title} | EvenFlow.AI`,
    description: event.description,
  }
}

export default function EventPage({ params }: EventPageProps) {
  const event = mockEvents.find((event) => event.id === params.id)

  if (!event) {
    notFound()
  }

  return <EventPageClient event={event} />
}

