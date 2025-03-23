"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  Sparkles,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockEvents } from "@/lib/mock-data"
import { EventCard } from "@/components/events/event-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog"

export default function EventsView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filter, setFilter] = useState(searchParams?.get("filter") || "all")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  // Get unique event types and locations for filters
  const eventTypes = Array.from(new Set(mockEvents.map((event) => event.type || "Conference")))

  const eventLocations = Array.from(
    new Set(
      mockEvents.map((event) => {
        const city = event.location.split(",")[0].trim()
        return city
      }),
    ),
  )

  // Filter events based on search query, status filter, and dropdown filters
  const filteredEvents = mockEvents.filter((event) => {
    // Search filter
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false

    if (!matchesSearch) return false

    // Status filter
    if (filter === "ongoing") {
      if (!(new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date())) {
        return false
      }
    } else if (filter === "upcoming") {
      if (!(new Date(event.startDate) > new Date())) {
        return false
      }
    } else if (filter === "past") {
      if (!(new Date(event.endDate) < new Date())) {
        return false
      }
    }

    // Type filter
    if (selectedTypes.length > 0) {
      if (!selectedTypes.includes(event.type || "Conference")) {
        return false
      }
    }

    // Location filter
    if (selectedLocations.length > 0) {
      const city = event.location.split(",")[0].trim()
      if (!selectedLocations.includes(city)) {
        return false
      }
    }

    return true
  })

  // Update URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams || "")
    if (filter !== "all") {
      params.set("filter", filter)
    } else {
      params.delete("filter")
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "/events"
    router.push(newUrl, { scroll: false })
  }, [filter, router, searchParams])

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Events" text="Browse and manage all your events">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-1 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </DashboardHeader>

        {/* Search and filters section */}
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events by name, location, or description..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Tabs defaultValue={filter} value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                  <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
                    <TabsTrigger value="all" className="gap-1">
                      <Calendar className="h-4 w-4" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="ongoing" className="gap-1">
                      <Clock className="h-4 w-4" />
                      Ongoing
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="gap-1">
                      <Sparkles className="h-4 w-4" />
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="past" className="gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Past
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Event Type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {eventTypes.map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes([...selectedTypes, type])
                            } else {
                              setSelectedTypes(selectedTypes.filter((t) => t !== type))
                            }
                          }}
                        >
                          {type}
                        </DropdownMenuCheckboxItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Location</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {eventLocations.map((location) => (
                        <DropdownMenuCheckboxItem
                          key={location}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLocations([...selectedLocations, location])
                            } else {
                              setSelectedLocations(selectedLocations.filter((l) => l !== location))
                            }
                          }}
                        >
                          {location}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <SlidersHorizontal className="h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuCheckboxItem checked>Date (Newest first)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Date (Oldest first)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Name (A-Z)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Name (Z-A)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Attendees (High-Low)</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="rounded-none h-10 w-10"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="rounded-none h-10 w-10"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results section */}
        <div className="mt-2">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} events
              {selectedTypes.length > 0 && ` • ${selectedTypes.length} types`}
              {selectedLocations.length > 0 && ` • ${selectedLocations.length} locations`}
            </div>

            {(selectedTypes.length > 0 || selectedLocations.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTypes([])
                  setSelectedLocations([])
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-380px)]">
            {filteredEvents.length > 0 ? (
              <div className={`grid gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {filteredEvents.map((event) => {
                  const status =
                    new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date()
                      ? "ongoing"
                      : new Date(event.startDate) > new Date()
                        ? "upcoming"
                        : "past"

                  return viewMode === "grid" ? (
                    <EventCard key={event.id} event={event} status={status} />
                  ) : (
                    <EventListItem key={event.id} event={event} status={status} />
                  )
                })}
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No events found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search term</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DashboardShell>

      <CreateEventDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  )
}

// List view item component
function EventListItem({ event, status }: { event: any; status: "ongoing" | "upcoming" | "past" }) {
  const router = useRouter()

  const getStatusBadge = () => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-blue-500">Ongoing</Badge>
      case "upcoming":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Upcoming
          </Badge>
        )
      case "past":
        return <Badge variant="secondary">Completed</Badge>
    }
  }

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => router.push(`/events/${event.id}`)}
    >
      <div className="flex flex-col sm:flex-row">
        <div
          className="h-24 sm:h-auto sm:w-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${event.coverImage || "/placeholder.svg?height=128&width=384"})`,
          }}
        />
        <CardContent className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{event.title}</h3>
              {getStatusBadge()}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center">
                <Badge variant="outline" className="font-normal">
                  {event.type || "Conference"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Clock className="mr-1 h-4 w-4" />
              <span>{event.location}</span>
            </div>

            <Button variant="ghost" size="sm">
              {status === "past" ? "View Summary" : "Manage Event"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

