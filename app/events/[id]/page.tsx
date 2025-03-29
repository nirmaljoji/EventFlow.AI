import type { Metadata } from "next"
import EventPageClient from "./event-page-client"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: "Event Details | EvenFlow.AI",
}

export default async function EventPage({
  params,
}: Readonly<EventPageProps>) {
  const { id } = await params;
  return <EventPageClient eventId={id} />
}
