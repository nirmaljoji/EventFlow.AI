import type { Metadata } from "next"
import EventPageClient from "./event-page-client"
import { FoodsProvider } from "@/hooks/use-foods"
import { LicensesProvider } from "@/hooks/use-licenses"
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
    // Apply height constraint to the container of ChatSidebar
    <div className="h-[calc(100vh-4rem)]">
      <ChatSidebar>
        {/* This div now takes full height relative to its ResizablePanel parent */}
        <div className="relative h-full overflow-auto">
          <FoodsProvider>
            <LicensesProvider>
              <EventPageClient eventId={id} />
            </LicensesProvider>
          </FoodsProvider>
        </div>
      </ChatSidebar>
    </div>
  )
}
