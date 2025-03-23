import { Clock, MapPin, Plus, Trash2 } from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EventTimelineTabProps {
  event: Event
}

export function EventTimelineTab({ event }: EventTimelineTabProps) {
  // Generate event start and end times
  const eventStart = new Date(event.startDate)
  const eventEnd = new Date(event.endDate)

  // Generate mock timeline items
  const timelineItems = [
    {
      time: new Date(eventStart.getTime()),
      title: "Event Check-in Opens",
      description: "Registration desk opens for attendee check-in",
      location: "Main Entrance",
      type: "logistics",
    },
    {
      time: new Date(eventStart.getTime() + 30 * 60000),
      title: "Welcome Address",
      description: "Opening remarks by event organizer",
      location: "Main Hall",
      type: "presentation",
    },
    {
      time: new Date(eventStart.getTime() + 60 * 60000),
      title: "Keynote Speaker",
      description: "Industry expert shares insights on latest trends",
      location: "Main Hall",
      type: "presentation",
    },
    {
      time: new Date(eventStart.getTime() + 120 * 60000),
      title: "Networking Break",
      description: "Coffee and refreshments provided",
      location: "Foyer",
      type: "break",
    },
    {
      time: new Date(eventStart.getTime() + 180 * 60000),
      title: "Panel Discussion",
      description: "Expert panel on innovation and future trends",
      location: "Conference Room A",
      type: "presentation",
    },
    {
      time: new Date(eventStart.getTime() + 240 * 60000),
      title: "Lunch",
      description: "Catered lunch for all attendees",
      location: "Dining Hall",
      type: "break",
    },
    {
      time: new Date(eventStart.getTime() + 300 * 60000),
      title: "Breakout Sessions",
      description: "Specialized topics in smaller groups",
      location: "Various Rooms",
      type: "workshop",
    },
    {
      time: new Date(eventStart.getTime() + 360 * 60000),
      title: "Closing Remarks",
      description: "Summary and next steps",
      location: "Main Hall",
      type: "presentation",
    },
    {
      time: new Date(eventEnd.getTime()),
      title: "Event Concludes",
      description: "Thank you for attending",
      location: "Main Entrance",
      type: "logistics",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Timeline</h2>
          <p className="text-muted-foreground">Schedule and agenda for your event</p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Schedule Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Schedule</CardTitle>
          <CardDescription>Manage your event agenda and timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="agenda">Agenda View</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <div className="relative space-y-0">
                {timelineItems.map((item, index) => (
                  <div key={index} className="relative pl-8 pb-8">
                    {/* Timeline connector */}
                    {index < timelineItems.length - 1 && (
                      <div className="absolute left-3 top-3 h-full w-px bg-border" />
                    )}

                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-3 h-6 w-6 rounded-full border-2 border-background p-1 ${
                        item.type === "presentation"
                          ? "bg-blue-500"
                          : item.type === "break"
                            ? "bg-green-500"
                            : item.type === "workshop"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                      }`}
                    >
                      <div className="h-full w-full rounded-full bg-background" />
                    </div>

                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge
                          variant={
                            item.type === "presentation"
                              ? "default"
                              : item.type === "break"
                                ? "secondary"
                                : item.type === "workshop"
                                  ? "outline"
                                  : "default"
                          }
                        >
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{item.description}</p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          <span>{item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agenda" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                  <div>Time</div>
                  <div className="col-span-2">Activity</div>
                  <div>Location</div>
                  <div>Actions</div>
                </div>

                {timelineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 items-center px-4 py-3 hover:bg-muted/50">
                    <div className="font-medium">
                      {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="col-span-2">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <div>{item.location}</div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="gap-1 w-full">
            <Plus className="h-4 w-4" />
            Add Schedule Item
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Day Checklist</CardTitle>
            <CardDescription>Tasks to complete on the day of the event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Set up registration desk", completed: true },
                { task: "Test AV equipment", completed: true },
                { task: "Brief staff and volunteers", completed: true },
                { task: "Arrange seating", completed: false },
                { task: "Set up catering stations", completed: false },
                { task: "Prepare speaker green room", completed: false },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div
                    className={`mt-1 h-4 w-4 rounded-sm border ${
                      item.completed ? "bg-primary border-primary" : "border-input"
                    }`}
                  >
                    {item.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary-foreground"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                    {item.task}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Contacts</CardTitle>
            <CardDescription>Important contacts for the day of the event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Event Manager", contact: "John Smith", phone: "(555) 123-4567", email: "john@example.com" },
                {
                  name: "Venue Coordinator",
                  contact: "Sarah Johnson",
                  phone: "(555) 987-6543",
                  email: "sarah@example.com",
                },
                { name: "Technical Support", contact: "Tech Team", phone: "(555) 456-7890", email: "tech@example.com" },
              ].map((contact, index) => (
                <div key={index}>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm">{contact.contact}</div>
                  <div className="text-sm text-muted-foreground">{contact.phone}</div>
                  <div className="text-sm text-muted-foreground">{contact.email}</div>
                  {index < 2 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

