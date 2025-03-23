import { CalendarDays, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Event } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EventTimelineProps {
  events: Event[]
}

export function EventTimeline({ events }: EventTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  return (
    <div className="space-y-8">
      {sortedEvents.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center gap-1 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No upcoming events</h3>
            <p className="text-sm text-muted-foreground">Create a new event to see your timeline</p>
          </div>
        </div>
      ) : (
        sortedEvents.map((event, index) => {
          const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date()

          return (
            <div key={event.id} className="relative pl-6">
              <div
                className={cn(
                  "absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-background",
                  isOngoing ? "bg-blue-500" : "bg-purple-500",
                )}
              />

              {index !== sortedEvents.length - 1 && (
                <div className="absolute left-1.5 top-4 h-full w-px -translate-x-1/2 bg-border" />
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  {isOngoing && (
                    <span className="flex items-center text-xs text-blue-500">
                      <Clock className="mr-1 h-3 w-3" />
                      Happening now
                    </span>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="mr-1 h-3 w-3" />
                  <span>
                    {new Date(event.startDate).toLocaleDateString()}
                    {isOngoing ? " - " : " · "}
                    {isOngoing
                      ? new Date(event.endDate).toLocaleDateString()
                      : formatDistanceToNow(new Date(event.startDate), { addSuffix: true })}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description || `${event.attendees} attendees at ${event.location}`}
                </p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

