"use client"

import { useState } from "react"
import {
  Download,
  Mail,
  Phone,
  Search,
  Upload,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Filter,
  MoreHorizontal,
  Send,
  Tag,
  UserCog,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ArrowUpDown,
  Eye,
  MessageSquare,
  Copy,
  FileText,
} from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EventGuestsTabProps {
  event: Event
}

// Guest type definition
type Guest = {
  id: string
  name: string
  email: string
  phone: string
  status: "confirmed" | "pending" | "declined"
  type: string
  tags: string[]
  rsvpDate?: string
  notes?: string
  dietaryRestrictions?: string
  isVIP: boolean
}

// Generate mock guest data
const generateMockGuests = (count: number, event: Event): Guest[] => {
  const statuses: ("confirmed" | "pending" | "declined")[] = ["confirmed", "pending", "declined"]
  const types = ["Attendee", "Speaker", "Staff", "Sponsor", "Media"]
  const tags = ["Early Bird", "Previous Attendee", "Group Booking", "Special Needs", "International"]

  return Array.from({ length: count }).map((_, index) => {
    // Distribute statuses: 70% confirmed, 20% pending, 10% declined
    let status: "confirmed" | "pending" | "declined"
    if (index < count * 0.7) {
      status = "confirmed"
    } else if (index < count * 0.9) {
      status = "pending"
    } else {
      status = "declined"
    }

    // Random selection of tags (0-2 tags per guest)
    const guestTags = []
    const tagCount = Math.floor(Math.random() * 3)
    for (let i = 0; i < tagCount; i++) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)]
      if (!guestTags.includes(randomTag)) {
        guestTags.push(randomTag)
      }
    }

    return {
      id: `guest-${index + 1}`,
      name: `Guest ${index + 1}`,
      email: `guest${index + 1}@example.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      status,
      type: types[Math.floor(Math.random() * types.length)],
      tags: guestTags,
      rsvpDate:
        status !== "pending"
          ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      notes: Math.random() > 0.7 ? "Some notes about this guest" : undefined,
      dietaryRestrictions:
        Math.random() > 0.8
          ? ["None", "Vegetarian", "Vegan", "Gluten-Free", "Nut Allergy"][Math.floor(Math.random() * 5)]
          : undefined,
      isVIP: index % 10 === 0, // Every 10th guest is a VIP
    }
  })
}

export function EventGuestsTab({ event }: EventGuestsTabProps) {
  // Generate mock guests based on event attendees
  const allGuests = generateMockGuests(event.attendees, event)

  // State for selected guests (for bulk actions)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isGuestDetailsOpen, setIsGuestDetailsOpen] = useState(false)

  // Filter guests based on search query and active filter
  const filteredGuests = allGuests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery)

    if (!matchesSearch) return false

    if (activeFilter === "vip") return guest.isVIP
    if (activeFilter === "dietary") return !!guest.dietaryRestrictions
    if (activeFilter === "notes") return !!guest.notes

    return true
  })

  // Guests by status
  const confirmedGuests = filteredGuests.filter((guest) => guest.status === "confirmed")
  const pendingGuests = filteredGuests.filter((guest) => guest.status === "pending")
  const declinedGuests = filteredGuests.filter((guest) => guest.status === "declined")

  // Handle select all guests
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGuests(filteredGuests.map((guest) => guest.id))
    } else {
      setSelectedGuests([])
    }
  }

  // Handle select individual guest
  const handleSelectGuest = (guestId: string, checked: boolean) => {
    if (checked) {
      setSelectedGuests([...selectedGuests, guestId])
    } else {
      setSelectedGuests(selectedGuests.filter((id) => id !== guestId))
    }
  }

  // Get status badge
  const getStatusBadge = (status: "confirmed" | "pending" | "declined") => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-50">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "declined":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        )
    }
  }

  // Guest details dialog
  const GuestDetailsDialog = () => (
    <Dialog open={isGuestDetailsOpen} onOpenChange={setIsGuestDetailsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        {selectedGuest && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>Guest Details</span>
                {selectedGuest.isVIP && <Badge className="bg-amber-500">VIP</Badge>}
              </DialogTitle>
              <DialogDescription>View and manage guest information</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-[100px_1fr] gap-4 py-4">
              <div className="flex flex-col items-center justify-start gap-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/placeholder.svg?height=80&width=80&text=${selectedGuest.name.charAt(0)}`} />
                  <AvatarFallback className="text-2xl">{selectedGuest.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {getStatusBadge(selectedGuest.status)}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedGuest.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedGuest.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedGuest.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedGuest.phone}</span>
                  </div>
                </div>

                {selectedGuest.rsvpDate && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">RSVP Date: </span>
                    {new Date(selectedGuest.rsvpDate).toLocaleDateString()}
                  </div>
                )}

                {selectedGuest.dietaryRestrictions && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Dietary Restrictions: </span>
                    {selectedGuest.dietaryRestrictions}
                  </div>
                )}

                {selectedGuest.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedGuest.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {selectedGuest.notes && (
                  <div className="rounded-md bg-muted p-2 text-sm">
                    <p className="font-medium">Notes:</p>
                    <p>{selectedGuest.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Communication History</h4>
              <div className="space-y-2 rounded-md bg-muted p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Invitation Sent</span>
                  <span className="text-muted-foreground">2 weeks ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">RSVP Received</span>
                  <span className="text-muted-foreground">10 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reminder Sent</span>
                  <span className="text-muted-foreground">3 days ago</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="gap-1">
                <UserCog className="h-4 w-4" />
                Edit Details
              </Button>
              <Button variant="destructive" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Remove Guest
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )

  // Guest table component
  const GuestTable = ({ guests }: { guests: Guest[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={guests.length > 0 && selectedGuests.length === guests.length}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                aria-label="Select all guests"
              />
            </TableHead>
            <TableHead className="w-[250px]">
              <div className="flex items-center gap-1">
                Guest
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Contact Information</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No guests found.
              </TableCell>
            </TableRow>
          ) : (
            guests.map((guest) => (
              <TableRow key={guest.id} className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedGuests.includes(guest.id)}
                    onCheckedChange={(checked) => handleSelectGuest(guest.id, !!checked)}
                    aria-label={`Select ${guest.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/placeholder.svg?height=36&width=36&text=${guest.name.charAt(0)}`} />
                      <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        {guest.name}
                        {guest.isVIP && <Badge className="ml-1 bg-amber-500 text-[10px] px-1 py-0">VIP</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guest.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{guest.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{guest.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(guest.status)}
                  {guest.rsvpDate && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(guest.rsvpDate).toLocaleDateString()}
                    </div>
                  )}
                </TableCell>
                <TableCell>{guest.type}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedGuest(guest)
                        setIsGuestDetailsOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="mr-2 h-4 w-4" />
                          Manage Tags
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          Mark as Declined
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Guest
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  // Guest cards view component
  const GuestCards = ({ guests }: { guests: Guest[] }) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {guests.map((guest) => (
        <Card key={guest.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${guest.name.charAt(0)}`} />
                  <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base flex items-center gap-1">
                    {guest.name}
                    {guest.isVIP && <Badge className="ml-1 bg-amber-500 text-[10px] px-1 py-0">VIP</Badge>}
                  </CardTitle>
                  <CardDescription>{guest.type}</CardDescription>
                </div>
              </div>
              <Checkbox
                checked={selectedGuests.includes(guest.id)}
                onCheckedChange={(checked) => handleSelectGuest(guest.id, !!checked)}
                aria-label={`Select ${guest.name}`}
              />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span>{guest.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span>{guest.phone}</span>
              </div>
              <div className="pt-1">
                {getStatusBadge(guest.status)}
                {guest.rsvpDate && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    RSVP: {new Date(guest.rsvpDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              {guest.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {guest.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => {
                setSelectedGuest(guest)
                setIsGuestDetailsOpen(true)
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="h-3.5 w-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Guest details dialog */}
      <GuestDetailsDialog />

      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Guest Management</h2>
          <p className="text-muted-foreground">Track and manage attendees for your event</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1">
            <UserPlus className="h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{event.attendees}</div>
                <p className="text-xs text-muted-foreground">Expected attendees</p>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-primary" />
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-50 p-2 dark:bg-green-900/20">
                <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {confirmedGuests.length}
                  </span>
                  <Badge className="bg-green-500">
                    {Math.round((confirmedGuests.length / event.attendees) * 100)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {confirmedGuests.length} of {event.attendees} guests
                </p>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-green-500" />
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-yellow-50 p-2 dark:bg-yellow-900/20">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {pendingGuests.length}
                  </span>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    {Math.round((pendingGuests.length / event.attendees) * 100)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Awaiting response</p>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-yellow-500" />
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-50 p-2 dark:bg-red-900/20">
                <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">{declinedGuests.length}</span>
                  <Badge variant="destructive">{Math.round((declinedGuests.length / event.attendees) * 100)}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Cannot attend</p>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-red-500" />
        </Card>
      </div>

      {/* Guest management tools */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Guest List</CardTitle>
              <CardDescription>Manage your event attendees</CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter Guests</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "vip"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "vip" ? null : "vip")}
                    >
                      VIP Guests
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "dietary"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "dietary" ? null : "dietary")}
                    >
                      Dietary Restrictions
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "notes"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "notes" ? null : "notes")}
                    >
                      Has Notes
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Select defaultValue="table" onValueChange={(value) => setViewMode(value as "table" | "cards")}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table View</SelectItem>
                    <SelectItem value="cards">Card View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedGuests.length > 0 && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-muted p-2">
              <span className="text-sm font-medium">{selectedGuests.length} guests selected</span>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Message
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  Tag
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      Status
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Mark as Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Mark as Declined
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-0">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger
                value="all"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                All Guests ({filteredGuests.length})
              </TabsTrigger>
              <TabsTrigger
                value="confirmed"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Confirmed ({confirmedGuests.length})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Pending ({pendingGuests.length})
              </TabsTrigger>
              <TabsTrigger
                value="declined"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Declined ({declinedGuests.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="max-h-[600px]">
              <TabsContent value="all" className="space-y-4">
                {viewMode === "table" ? <GuestTable guests={filteredGuests} /> : <GuestCards guests={filteredGuests} />}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-4">
                {viewMode === "table" ? (
                  <GuestTable guests={confirmedGuests} />
                ) : (
                  <GuestCards guests={confirmedGuests} />
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {viewMode === "table" ? <GuestTable guests={pendingGuests} /> : <GuestCards guests={pendingGuests} />}
              </TabsContent>

              <TabsContent value="declined" className="space-y-4">
                {viewMode === "table" ? <GuestTable guests={declinedGuests} /> : <GuestCards guests={declinedGuests} />}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredGuests.length} of {event.attendees} guests
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Communication tools */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Communication</CardTitle>
          <CardDescription>Send messages and updates to your guests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start gap-2">
                  <Send className="h-4 w-4" />
                  Send Invitations
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Send className="h-4 w-4" />
                  Send Reminders
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Event Updates
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Invite Link
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Communication Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Invitations Sent</span>
                  <span className="font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Opened</span>
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Responded</span>
                  <span className="font-medium">
                    {Math.round(((confirmedGuests.length + declinedGuests.length) / event.attendees) * 100)}%
                  </span>
                </div>
                <Progress
                  value={Math.round(((confirmedGuests.length + declinedGuests.length) / event.attendees) * 100)}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

