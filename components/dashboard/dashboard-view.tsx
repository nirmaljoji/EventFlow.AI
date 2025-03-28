"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Calendar, Clock, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardHeader } from "./dashboard-header"
import { DashboardShell } from "./dashboard-shell"
import { EventCard } from "./event-card"
import { CreateEventDialog } from "./create-event-dialog"
import { EventStats } from "./event-stats"
import { EventTimeline } from "./event-timeline"
import { eventsApi } from "@/lib/api-client"
import { Event } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

export default function DashboardView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<{
    stats: {
      total: number;
      ongoing: number;
      upcoming: number;
      completed: number;
    },
    events: {
      ongoing: Event[];
      upcoming: Event[];
      past: Event[];
      timeline: Event[];
    }
  }>({
    stats: {
      total: 0,
      ongoing: 0,
      upcoming: 0,
      completed: 0
    },
    events: {
      ongoing: [],
      upcoming: [],
      past: [],
      timeline: []
    }
  })

  // Function to load dashboard data
  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const response = await eventsApi.getDashboard()
      console.log("Dashboard response:", response)
      
      if (response.success) {
        // Transform backend data to match frontend Event type
        const transformEvents = (events: any[]): Event[] => {
          return events.map(event => {
            try {
              // Ensure we have valid dates by handling the conversion safely
              let startDate = event.dateTime;
              let endDate = event.endDate;
              
              // Make sure dates are strings in ISO format
              if (!(typeof startDate === 'string')) {
                // If startDate is not a string (maybe it's a Date object in response), convert to ISO string
                startDate = new Date(startDate).toISOString();
              }
              
              if (endDate && !(typeof endDate === 'string')) {
                // If endDate is not a string, convert to ISO string
                endDate = new Date(endDate).toISOString();
              } else if (!endDate) {
                // If no endDate, default to 1 day after startDate
                const start = new Date(startDate);
                endDate = new Date(start.getTime() + 24 * 60 * 60 * 1000).toISOString();
              }
              
              return {
                id: event.id,
                title: event.eventName,
                description: event.description || "",
                startDate: startDate,
                endDate: endDate,
                location: event.location,
                attendees: event.attendees,
                organizer: "EventFlow.AI", // Default organizer
                coverImage: "/placeholder.svg?height=128&width=384&text=Event",
              };
            } catch (error) {
              console.error("Error transforming event:", error, event);
              // Return a default event with minimal data
              return {
                id: event.id || "error-id",
                title: event.eventName || "Event Error",
                description: "Error loading event data",
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                location: "Unknown",
                attendees: 0,
                organizer: "EventFlow.AI",
                coverImage: "/placeholder.svg?height=128&width=384&text=Error",
              };
            }
          });
        };

        setDashboardData({
          stats: response.stats,
          events: {
            ongoing: transformEvents(response.events.ongoing),
            upcoming: transformEvents(response.events.upcoming),
            past: transformEvents(response.events.past),
            timeline: transformEvents(response.events.timeline)
          }
        })
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Refresh data after creating a new event
  const handleEventCreated = () => {
    loadDashboardData()
  }

  const { stats, events } = dashboardData

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Event Dashboard" text="Manage your events and create new ones.">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-1 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
          >
            <PlusCircle className="h-4 w-4" />
            Create Event
          </Button>
        </DashboardHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EventStats title="Total Events" value={stats.total.toString()} icon={Calendar} />
          <EventStats
            title="Ongoing"
            value={stats.ongoing.toString()}
            icon={Clock}
            className="bg-blue-50 dark:bg-blue-950"
          />
          <EventStats
            title="Upcoming"
            value={stats.upcoming.toString()}
            icon={Sparkles}
            className="bg-purple-50 dark:bg-purple-950"
          />
          <EventStats
            title="Completed"
            value={stats.completed.toString()}
            icon={CheckCircle}
            className="bg-green-50 dark:bg-green-950"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Events Overview</CardTitle>
              <CardDescription>Manage and track all your events in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ongoing" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="ongoing" className="gap-1">
                    <Clock className="h-4 w-4" />
                    Ongoing
                    <Badge variant="secondary" className="ml-1">
                      {events.ongoing.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="gap-1">
                    <Sparkles className="h-4 w-4" />
                    Upcoming
                    <Badge variant="secondary" className="ml-1">
                      {events.upcoming.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="past" className="gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Past
                    <Badge variant="secondary" className="ml-1">
                      {events.past.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ongoing" className="space-y-4">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-4 md:grid-cols-2">
                      {loading ? (
                        <div className="col-span-2 flex h-[300px] items-center justify-center">
                          <div className="animate-spin h-10 w-10 border-2 border-blue-500 rounded-full border-t-transparent" />
                        </div>
                      ) : events.ongoing.length > 0 ? (
                        events.ongoing.map((event) => <EventCard key={event.id} event={event} status="ongoing" />)
                      ) : (
                        <div className="col-span-2 flex h-[300px] items-center justify-center rounded-md border border-dashed">
                          <div className="flex flex-col items-center gap-1 text-center">
                            <Calendar className="h-10 w-10 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">No ongoing events</h3>
                            <p className="text-sm text-muted-foreground">Create a new event to get started</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-4 md:grid-cols-2">
                      {loading ? (
                        <div className="col-span-2 flex h-[300px] items-center justify-center">
                          <div className="animate-spin h-10 w-10 border-2 border-blue-500 rounded-full border-t-transparent" />
                        </div>
                      ) : events.upcoming.length > 0 ? (
                        events.upcoming.map((event) => <EventCard key={event.id} event={event} status="upcoming" />)
                      ) : (
                        <div className="col-span-2 flex h-[300px] items-center justify-center rounded-md border border-dashed">
                          <div className="flex flex-col items-center gap-1 text-center">
                            <Sparkles className="h-10 w-10 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">No upcoming events</h3>
                            <p className="text-sm text-muted-foreground">Plan your next event</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-4 md:grid-cols-2">
                      {loading ? (
                        <div className="col-span-2 flex h-[300px] items-center justify-center">
                          <div className="animate-spin h-10 w-10 border-2 border-blue-500 rounded-full border-t-transparent" />
                        </div>
                      ) : events.past.length > 0 ? (
                        events.past.map((event) => <EventCard key={event.id} event={event} status="past" />)
                      ) : (
                        <div className="col-span-2 flex h-[300px] items-center justify-center rounded-md border border-dashed">
                          <div className="flex flex-col items-center gap-1 text-center">
                            <CheckCircle className="h-10 w-10 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">No past events</h3>
                            <p className="text-sm text-muted-foreground">Your completed events will appear here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>Your upcoming event schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-[300px] items-center justify-center">
                  <div className="animate-spin h-10 w-10 border-2 border-blue-500 rounded-full border-t-transparent" />
                </div>
              ) : (
                <EventTimeline events={events.timeline} />
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardShell>

      <CreateEventDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onEventCreated={handleEventCreated} 
      />
    </>
  )
}

