"use client"

import { useState, useEffect } from "react"
import EventDetails from "@/components/events/event-details"
import { eventsApi } from "@/lib/api-client"

interface EventPageClientProps {
  eventId: string
}

export default function EventPageClient({ eventId }: EventPageClientProps) {
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsApi.getEvent(eventId)
        if (response.success) {
          // Transform the event data to match the expected format
          const eventData = {
            ...response.event,
            title: response.event.eventName,
            startDate: response.event.dateTime,
          }
          setEvent(eventData)
        }
      } catch (error) {
        console.error("Failed to fetch event:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (isLoading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!event) {
    return <div>Event not found</div>
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-auto pt-0">
      <EventDetails event={event} />
    </div>
  )
}

