"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, CalendarDays, MapPin, Users, Clock, Edit, Share2, MoreHorizontal } from "lucide-react"
import type { Event } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EventOverviewTab } from "./tabs/event-overview-tab"
import { EventFoodTab } from "./tabs/event-food-tab"
import { EventLicensesTab } from "./tabs/event-licenses-tab"
import { EventGuestsTab } from "./tabs/event-guests-tab"
import { EventTimelineTab } from "./tabs/event-timeline-tab"

interface EventDetailsProps {
  event: Event
}

export default function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date()
  const isPast = new Date(event.endDate) < new Date()
  const isUpcoming = new Date(event.startDate) > new Date()

  const getStatusBadge = () => {
    if (isOngoing) return <Badge className="bg-blue-500">Ongoing</Badge>
    if (isPast) return <Badge variant="secondary">Completed</Badge>
    if (isUpcoming)
      return (
        <Badge variant="outline" className="border-purple-500 text-purple-500">
          Upcoming
        </Badge>
      )
  }

  return (
    <div className="mx-auto h-full w-full max-w-7xl p-6 overflow-y-auto">
      <div className="mb-6 flex flex-col space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/events">Events</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{event.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate Event</DropdownMenuItem>
                <DropdownMenuItem>Export Details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Cancel Event</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-muted/30 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              {getStatusBadge()}
            </div>

            <p className="mb-4 text-muted-foreground">{event.description || "No description provided."}</p>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>
          </div>

          {isOngoing && (
            <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <div className="mb-1 flex items-center text-blue-600">
                <Clock className="mr-1 h-5 w-5" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <div className="text-2xl font-bold">3 days left</div>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="bg-background px-6 py-2 -mx-6 overflow-x-auto">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 flex-nowrap min-w-max">
            <TabsTrigger
              value="overview"
              className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="food"
              className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary whitespace-nowrap"
            >
              Food & Catering
            </TabsTrigger>
            <TabsTrigger
              value="licenses"
              className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary whitespace-nowrap"
            >
              Licenses & Permits
            </TabsTrigger>
            <TabsTrigger
              value="guests"
              className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary whitespace-nowrap"
            >
              Guest Management
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary"
            >
              Timeline
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <EventOverviewTab event={event} />
        </TabsContent>

        <TabsContent value="food" className="space-y-4">
          <EventFoodTab event={event} />
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4">
          <EventLicensesTab event={event} />
        </TabsContent>

        <TabsContent value="guests" className="space-y-4">
          <EventGuestsTab event={event} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <EventTimelineTab event={event} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

