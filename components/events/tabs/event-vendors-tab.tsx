"use client"

import { useState } from "react"
import {
  Building,
  Camera,
  ChevronDown,
  Clapperboard,
  Edit,
  ExternalLink,
  Filter,
  Lightbulb,
  Mail,
  MapPin,
  Megaphone,
  Music,
  Phone,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  Truck,
  Tv,
  Users,
} from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

interface EventVendorsTabProps {
  event: Event
}

// Vendor type definition
type Vendor = {
  id: string
  name: string
  category:
    | "lighting"
    | "sound"
    | "decoration"
    | "photography"
    | "videography"
    | "entertainment"
    | "transportation"
    | "av"
    | "marketing"
  description: string
  contactName: string
  email: string
  phone: string
  website?: string
  address?: string
  cost: number
  deposit: number
  isPaid: boolean
  rating: number
  status: "confirmed" | "pending" | "canceled"
  notes?: string
  setupTime?: string
  breakdownTime?: string
  services: string[]
  image?: string
}

// Generate mock vendor data
const generateMockVendors = (count: number): Vendor[] => {
  const categories: (
    | "lighting"
    | "sound"
    | "decoration"
    | "photography"
    | "videography"
    | "entertainment"
    | "transportation"
    | "av"
    | "marketing"
  )[] = [
    "lighting",
    "sound",
    "decoration",
    "photography",
    "videography",
    "entertainment",
    "transportation",
    "av",
    "marketing",
  ]

  const services = {
    lighting: ["Stage Lighting", "Ambient Lighting", "Uplighting", "Spotlights", "LED Walls", "Laser Shows"],
    sound: ["Sound System", "Microphones", "DJ Equipment", "Live Sound Mixing", "Speakers", "Acoustic Treatment"],
    decoration: ["Floral Arrangements", "Table Settings", "Backdrops", "Props", "Balloon Decor", "Themed Decorations"],
    photography: [
      "Event Coverage",
      "Portrait Sessions",
      "Photo Booth",
      "Drone Photography",
      "Product Shots",
      "Editing Services",
    ],
    videography: [
      "Event Coverage",
      "Highlight Reels",
      "Live Streaming",
      "Drone Footage",
      "Editing Services",
      "Interviews",
    ],
    entertainment: [
      "Live Band",
      "DJ Services",
      "Performers",
      "MC Services",
      "Interactive Activities",
      "Celebrity Appearances",
    ],
    transportation: [
      "Guest Shuttles",
      "VIP Transportation",
      "Equipment Transport",
      "Valet Services",
      "Coordination",
      "Airport Transfers",
    ],
    av: ["Projectors", "Screens", "Live Streaming", "Recording Services", "Technical Support", "Equipment Rental"],
    marketing: [
      "Event Promotion",
      "Social Media",
      "Print Materials",
      "Digital Advertising",
      "PR Services",
      "Brand Activation",
    ],
  }

  return Array.from({ length: count }).map((_, index) => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const vendorServices = services[category]
    const selectedServices: string[] = []
    const serviceCount = Math.floor(Math.random() * 4) + 1 // 1-4 services

    for (let i = 0; i < serviceCount; i++) {
      const randomService = vendorServices[Math.floor(Math.random() * vendorServices.length)]
      if (!selectedServices.includes(randomService)) {
        selectedServices.push(randomService)
      }
    }

    const cost = Math.floor(Math.random() * 5000) + 500
    const deposit = Math.floor(cost * (Math.random() * 0.5 + 0.2)) // 20-70% of cost

    const statuses: ("confirmed" | "pending" | "canceled")[] = ["confirmed", "pending", "canceled"]
    const status = statuses[Math.floor(Math.random() * (index === 0 ? 2 : 3))] // Ensure first vendor is not canceled

    return {
      id: `vendor-${index + 1}`,
      name: `${getCategoryName(category)} Vendor ${index + 1}`,
      category,
      description: `Professional ${getCategoryName(category).toLowerCase()} services for events of all sizes.`,
      contactName: `Contact ${index + 1}`,
      email: `vendor${index + 1}@example.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: Math.random() > 0.3 ? `https://vendor${index + 1}.example.com` : undefined,
      address: Math.random() > 0.5 ? `${Math.floor(Math.random() * 1000) + 100} Main St, City, State` : undefined,
      cost,
      deposit,
      isPaid: Math.random() > 0.6,
      rating: Math.floor(Math.random() * 2) + 3 + Math.random(), // 3-5 stars
      status,
      notes: Math.random() > 0.7 ? "Custom requirements discussed and agreed upon." : undefined,
      setupTime: Math.random() > 0.5 ? `${Math.floor(Math.random() * 3) + 1} hours before event` : undefined,
      breakdownTime: Math.random() > 0.5 ? `${Math.floor(Math.random() * 2) + 1} hours after event` : undefined,
      services: selectedServices,
      image: `/placeholder.svg?height=100&width=100&text=${getCategoryName(category).charAt(0)}`,
    }
  })
}

// Helper function to get category display name
const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    lighting: "Lighting",
    sound: "Sound",
    decoration: "Decoration",
    photography: "Photography",
    videography: "Videography",
    entertainment: "Entertainment",
    transportation: "Transportation",
    av: "AV Equipment",
    marketing: "Marketing",
  }
  return names[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "lighting":
      return <Lightbulb className="h-4 w-4" />
    case "sound":
      return <Music className="h-4 w-4" />
    case "decoration":
      return <Tag className="h-4 w-4" />
    case "photography":
      return <Camera className="h-4 w-4" />
    case "videography":
      return <Clapperboard className="h-4 w-4" />
    case "entertainment":
      return <Users className="h-4 w-4" />
    case "transportation":
      return <Truck className="h-4 w-4" />
    case "av":
      return <Tv className="h-4 w-4" />
    case "marketing":
      return <Megaphone className="h-4 w-4" />
    default:
      return <Building className="h-4 w-4" />
  }
}

export function EventVendorsTab({ event }: EventVendorsTabProps) {
  // Generate mock vendors
  const [vendors, setVendors] = useState<Vendor[]>(generateMockVendors(12))
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isVendorDetailsOpen, setIsVendorDetailsOpen] = useState(false)
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false)
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: "",
    category: "lighting",
    description: "",
    contactName: "",
    email: "",
    phone: "",
    cost: 0,
    deposit: 0,
    isPaid: false,
    rating: 5,
    status: "pending",
    services: [],
  })

  // Filter vendors based on search query and active filter
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactName.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeFilter && activeFilter !== "all") return vendor.category === activeFilter

    return true
  })

  // Vendors by status
  const confirmedVendors = filteredVendors.filter((vendor) => vendor.status === "confirmed")
  const pendingVendors = filteredVendors.filter((vendor) => vendor.status === "pending")
  const canceledVendors = filteredVendors.filter((vendor) => vendor.status === "canceled")

  // Calculate total cost and paid amount
  const totalCost = vendors.reduce((sum, vendor) => sum + vendor.cost, 0)
  const paidAmount = vendors.filter((v) => v.isPaid).reduce((sum, vendor) => sum + vendor.deposit, 0)
  const remainingAmount = totalCost - paidAmount

  // Handle adding a new vendor
  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.contactName || !newVendor.email || !newVendor.phone) {
      return
    }

    const vendor: Vendor = {
      id: `vendor-${vendors.length + 1}`,
      name: newVendor.name || "",
      category: (newVendor.category as any) || "lighting",
      description: newVendor.description || "",
      contactName: newVendor.contactName || "",
      email: newVendor.email || "",
      phone: newVendor.phone || "",
      website: newVendor.website,
      address: newVendor.address,
      cost: newVendor.cost || 0,
      deposit: newVendor.deposit || 0,
      isPaid: newVendor.isPaid || false,
      rating: newVendor.rating || 5,
      status: (newVendor.status as any) || "pending",
      notes: newVendor.notes,
      setupTime: newVendor.setupTime,
      breakdownTime: newVendor.breakdownTime,
      services: newVendor.services || [],
      image: `/placeholder.svg?height=100&width=100&text=${getCategoryName(newVendor.category || "").charAt(0)}`,
    }

    setVendors([...vendors, vendor])
    setIsAddVendorOpen(false)
    setNewVendor({
      name: "",
      category: "lighting",
      description: "",
      contactName: "",
      email: "",
      phone: "",
      cost: 0,
      deposit: 0,
      isPaid: false,
      rating: 5,
      status: "pending",
      services: [],
    })
  }

  // Vendor details dialog
  const VendorDetailsDialog = () => (
    <Dialog open={isVendorDetailsOpen} onOpenChange={setIsVendorDetailsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        {selectedVendor && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>{selectedVendor.name}</span>
                <Badge className="capitalize">
                  {getCategoryIcon(selectedVendor.category)}
                  <span className="ml-1">{getCategoryName(selectedVendor.category)}</span>
                </Badge>
              </DialogTitle>
              <DialogDescription>Vendor details and contract information</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-[100px_1fr] gap-4 py-4">
              <div className="flex flex-col items-center justify-start gap-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedVendor.image} />
                  <AvatarFallback className="text-2xl">
                    {getCategoryName(selectedVendor.category).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  className={
                    selectedVendor.status === "confirmed"
                      ? "bg-green-500"
                      : selectedVendor.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }
                >
                  {selectedVendor.status.charAt(0).toUpperCase() + selectedVendor.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedVendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedVendor.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedVendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedVendor.phone}</span>
                  </div>
                </div>

                {selectedVendor.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={selectedVendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedVendor.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                {selectedVendor.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedVendor.address}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(selectedVendor.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : i < selectedVendor.rating
                            ? "fill-yellow-400 text-yellow-400 opacity-50"
                            : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-muted-foreground">({selectedVendor.rating.toFixed(1)})</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Financial Details</h4>
                  <div className="mt-2 space-y-2 rounded-md bg-muted p-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-medium">${selectedVendor.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deposit Required:</span>
                      <span className="font-medium">${selectedVendor.deposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <Badge
                        variant={selectedVendor.isPaid ? "default" : "outline"}
                        className={selectedVendor.isPaid ? "bg-green-500" : ""}
                      >
                        {selectedVendor.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Timing Information</h4>
                  <div className="mt-2 space-y-2 rounded-md bg-muted p-3 text-sm">
                    {selectedVendor.setupTime && (
                      <div className="flex justify-between">
                        <span>Setup Time:</span>
                        <span className="font-medium">{selectedVendor.setupTime}</span>
                      </div>
                    )}
                    {selectedVendor.breakdownTime && (
                      <div className="flex justify-between">
                        <span>Breakdown Time:</span>
                        <span className="font-medium">{selectedVendor.breakdownTime}</span>
                      </div>
                    )}
                    {!selectedVendor.setupTime && !selectedVendor.breakdownTime && (
                      <div className="text-center text-muted-foreground">No timing information provided</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Services Provided</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedVendor.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedVendor.notes && (
                <div>
                  <h4 className="font-medium">Notes</h4>
                  <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                    <p>{selectedVendor.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit Details
              </Button>
              <Button variant="outline" className="gap-1">
                <Mail className="h-4 w-4" />
                Contact Vendor
              </Button>
              <Button variant="destructive" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Remove Vendor
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )

  // Add Vendor Dialog
  const AddVendorDialog = () => (
    <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogDescription>Enter the details of the vendor you want to add</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-name">Vendor Name</Label>
              <Input
                id="vendor-name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                placeholder="Enter vendor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-category">Category</Label>
              <Select
                value={newVendor.category}
                onValueChange={(value) => setNewVendor({ ...newVendor, category: value as any })}
              >
                <SelectTrigger id="vendor-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lighting">Lighting</SelectItem>
                  <SelectItem value="sound">Sound</SelectItem>
                  <SelectItem value="decoration">Decoration</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="av">AV Equipment</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-description">Description</Label>
            <Textarea
              id="vendor-description"
              value={newVendor.description}
              onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
              placeholder="Describe the vendor's services"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-contact">Contact Person</Label>
              <Input
                id="vendor-contact"
                value={newVendor.contactName}
                onChange={(e) => setNewVendor({ ...newVendor, contactName: e.target.value })}
                placeholder="Contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-email">Email</Label>
              <Input
                id="vendor-email"
                type="email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-phone">Phone</Label>
              <Input
                id="vendor-phone"
                value={newVendor.phone}
                onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-website">Website (Optional)</Label>
              <Input
                id="vendor-website"
                value={newVendor.website}
                onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-cost">Total Cost ($)</Label>
              <Input
                id="vendor-cost"
                type="number"
                value={newVendor.cost?.toString()}
                onChange={(e) => setNewVendor({ ...newVendor, cost: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-deposit">Deposit Amount ($)</Label>
              <Input
                id="vendor-deposit"
                type="number"
                value={newVendor.deposit?.toString()}
                onChange={(e) => setNewVendor({ ...newVendor, deposit: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-status">Status</Label>
              <Select
                value={newVendor.status}
                onValueChange={(value) => setNewVendor({ ...newVendor, status: value as any })}
              >
                <SelectTrigger id="vendor-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-paid">Payment Status</Label>
              <Select
                value={newVendor.isPaid ? "paid" : "unpaid"}
                onValueChange={(value) => setNewVendor({ ...newVendor, isPaid: value === "paid" })}
              >
                <SelectTrigger id="vendor-paid">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-notes">Notes (Optional)</Label>
            <Textarea
              id="vendor-notes"
              value={newVendor.notes}
              onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
              placeholder="Additional notes about the vendor"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddVendorOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddVendor}>Add Vendor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Vendor Grid View
  const VendorGridView = ({ vendors }: { vendors: Vendor[] }) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => (
        <Card key={vendor.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <Badge className="mb-2 capitalize">
                {getCategoryIcon(vendor.category)}
                <span className="ml-1">{getCategoryName(vendor.category)}</span>
              </Badge>
              <Badge
                className={
                  vendor.status === "confirmed"
                    ? "bg-green-500"
                    : vendor.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              >
                {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
              </Badge>
            </div>
            <CardTitle className="text-lg flex items-center gap-1">{vendor.name}</CardTitle>
            <CardDescription className="line-clamp-2">{vendor.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(vendor.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : i < vendor.rating
                            ? "fill-yellow-400 text-yellow-400 opacity-50"
                            : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">({vendor.rating.toFixed(1)})</span>
                </div>
                <Badge variant={vendor.isPaid ? "default" : "outline"} className={vendor.isPaid ? "bg-green-500" : ""}>
                  {vendor.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>

              <div className="flex flex-col space-y-1 text-sm">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <span>{vendor.phone}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-medium">
                <div>Total Cost:</div>
                <div>${vendor.cost.toLocaleString()}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {vendor.services.slice(0, 2).map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {vendor.services.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{vendor.services.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="w-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => {
                setSelectedVendor(vendor)
                setIsVendorDetailsOpen(true)
              }}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}

      {vendors.length === 0 && (
        <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center gap-1 text-center">
            <Building className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No vendors found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  )

  // Vendor List View
  const VendorListView = ({ vendors }: { vendors: Vendor[] }) => (
    <div className="rounded-md border">
      <div className="grid grid-cols-7 border-b px-4 py-3 font-medium">
        <div className="col-span-2">Vendor</div>
        <div>Category</div>
        <div>Contact</div>
        <div>Cost</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      {vendors.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-center">
          <p className="text-muted-foreground">No vendors found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        vendors.map((vendor) => (
          <div key={vendor.id} className="grid grid-cols-7 items-center px-4 py-3 hover:bg-muted/50">
            <div className="col-span-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={vendor.image} />
                  <AvatarFallback>{getCategoryName(vendor.category).charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{vendor.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{vendor.description}</div>
                </div>
              </div>
            </div>
            <div>
              <Badge className="capitalize">
                {getCategoryIcon(vendor.category)}
                <span className="ml-1 hidden sm:inline">{getCategoryName(vendor.category)}</span>
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <div className="line-clamp-1">{vendor.contactName}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{vendor.email}</div>
            </div>
            <div>
              <div className="font-medium">${vendor.cost.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{vendor.isPaid ? "Paid" : "Unpaid"}</div>
            </div>
            <div>
              <Badge
                className={
                  vendor.status === "confirmed"
                    ? "bg-green-500"
                    : vendor.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              >
                {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedVendor(vendor)
                  setIsVendorDetailsOpen(true)
                }}
              >
                View
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Contact</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Vendor details dialog */}
      <VendorDetailsDialog />

      {/* Add vendor dialog */}
      <AddVendorDialog />

      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendors</h2>
          <p className="text-muted-foreground">Manage all service providers for your event</p>
        </div>
        <Button className="gap-1" onClick={() => setIsAddVendorOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">
              {confirmedVendors.length} confirmed, {pendingVendors.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalCost / (event.budget || 15000)) * 100)}% of event budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidAmount.toLocaleString()}</div>
            <div className="mt-1">
              <Progress value={(paidAmount / totalCost) * 100} className="h-2" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round((paidAmount / totalCost) * 100)}% of total cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${remainingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Due before event date</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendor management tools */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Vendor List</CardTitle>
              <CardDescription>Manage your event service providers</CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
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
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === null}
                      onCheckedChange={() => setActiveFilter(null)}
                    >
                      All Categories
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "lighting"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "lighting" ? null : "lighting")}
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Lighting
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "sound"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "sound" ? null : "sound")}
                    >
                      <Music className="mr-2 h-4 w-4" />
                      Sound
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "decoration"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "decoration" ? null : "decoration")}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Decoration
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "photography"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "photography" ? null : "photography")}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Photography
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilter === "videography"}
                      onCheckedChange={() => setActiveFilter(activeFilter === "videography" ? null : "videography")}
                    >
                      <Clapperboard className="mr-2 h-4 w-4" />
                      Videography
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Select defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="list">List View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-0">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger
                value="all"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                All Vendors ({filteredVendors.length})
              </TabsTrigger>
              <TabsTrigger
                value="confirmed"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Confirmed ({confirmedVendors.length})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Pending ({pendingVendors.length})
              </TabsTrigger>
              <TabsTrigger
                value="canceled"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Canceled ({canceledVendors.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="max-h-[600px]">
              <TabsContent value="all" className="space-y-4">
                {viewMode === "grid" ? (
                  <VendorGridView vendors={filteredVendors} />
                ) : (
                  <VendorListView vendors={filteredVendors} />
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-4">
                {viewMode === "grid" ? (
                  <VendorGridView vendors={confirmedVendors} />
                ) : (
                  <VendorListView vendors={confirmedVendors} />
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {viewMode === "grid" ? (
                  <VendorGridView vendors={pendingVendors} />
                ) : (
                  <VendorListView vendors={pendingVendors} />
                )}
              </TabsContent>

              <TabsContent value="canceled" className="space-y-4">
                {viewMode === "grid" ? (
                  <VendorGridView vendors={canceledVendors} />
                ) : (
                  <VendorListView vendors={canceledVendors} />
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredVendors.length} of {vendors.length} vendors
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
    </div>
  )
}

