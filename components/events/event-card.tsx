import { CalendarDays, MapPin, Users, MoreHorizontal, Clock, Tag, Leaf } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Event } from "@/lib/types"
import Link from "next/link"

interface EventCardProps {
  event: Event
  status: "ongoing" | "upcoming" | "past"
}

export function EventCard({ event, status }: EventCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-blue-500">Ongoing</Badge>
      case "upcoming":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            {formatDistanceToNow(new Date(event.startDate), { addSuffix: true })}
          </Badge>
        )
      case "past":
        return <Badge variant="secondary">Completed</Badge>
    }
  }

  // Calculate progress for ongoing events
  const calculateProgress = () => {
    if (status !== "ongoing") return 100

    const start = new Date(event.startDate).getTime()
    const end = new Date(event.endDate).getTime()
    const now = new Date().getTime()

    return Math.min(Math.round(((now - start) / (end - start)) * 100), 100)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="p-0">
        <div
          className="h-40 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${event.coverImage || "/placeholder.svg?height=160&width=384"})`,
          }}
        >
          <div className="flex h-full w-full flex-col justify-between bg-black/20 p-4">
            <div className="flex justify-between">
              {getStatusBadge()}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 text-white hover:bg-black/40">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Event</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Cancel Event</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold text-white drop-shadow-md">{event.title}</h3>
                {event.sustainable && (
                  <div className="bg-green-500 rounded-full p-0.5">
                    <Leaf className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <Badge variant="outline" className="mt-1 bg-black/30 text-white border-white/30">
                <Tag className="mr-1 h-3 w-3" />
                {event.type || "Conference"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4" />
            <span>
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>{event.attendees} attendees</span>
            </div>

            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          {status === "ongoing" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-1" />
            </div>
          )}

          {status === "upcoming" && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>Starts {formatDistanceToNow(new Date(event.startDate), { addSuffix: true })}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" size="sm" asChild>
          <Link href={`/events/${event.id}`}>{status === "past" ? "View Summary" : "Manage Event"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

