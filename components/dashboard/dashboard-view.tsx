"use client"

import { useState } from "react"
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
import { mockEvents } from "@/lib/mock-data"

export default function DashboardView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const ongoingEvents = mockEvents.filter(
    (event) => new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date(),
  )

  const pastEvents = mockEvents.filter((event) => new Date(event.endDate) < new Date())

  const upcomingEvents = mockEvents.filter((event) => new Date(event.startDate) > new Date())

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
          <EventStats title="Total Events" value={mockEvents.length.toString()} icon={Calendar} />
          <EventStats
            title="Ongoing"
            value={ongoingEvents.length.toString()}
            icon={Clock}
            className="bg-blue-50 dark:bg-blue-950"
          />
          <EventStats
            title="Upcoming"
            value={upcomingEvents.length.toString()}
            icon={Sparkles}
            className="bg-purple-50 dark:bg-purple-950"
          />
          <EventStats
            title="Completed"
            value={pastEvents.length.toString()}
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
                      {ongoingEvents.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="gap-1">
                    <Sparkles className="h-4 w-4" />
                    Upcoming
                    <Badge variant="secondary" className="ml-1">
                      {upcomingEvents.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="past" className="gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Past
                    <Badge variant="secondary" className="ml-1">
                      {pastEvents.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ongoing" className="space-y-4">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-4 md:grid-cols-2">
                      {ongoingEvents.length > 0 ? (
                        ongoingEvents.map((event) => <EventCard key={event.id} event={event} status="ongoing" />)
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
                      {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event) => <EventCard key={event.id} event={event} status="upcoming" />)
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
                      {pastEvents.length > 0 ? (
                        pastEvents.map((event) => <EventCard key={event.id} event={event} status="past" />)
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
              <EventTimeline events={[...ongoingEvents, ...upcomingEvents].slice(0, 5)} />
            </CardContent>
          </Card>
        </div>
      </DashboardShell>

      <CreateEventDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  )
}

