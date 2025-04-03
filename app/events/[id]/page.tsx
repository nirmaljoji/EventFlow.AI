import type { Metadata } from "next"
import EventPageClient from "./event-page-client"
import { ChatSidebar } from "@/components/ai-chat/chat-sidebar"

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
  return (
    <ChatSidebar>
      <EventPageClient eventId={id} />
    </ChatSidebar>
  )
}
