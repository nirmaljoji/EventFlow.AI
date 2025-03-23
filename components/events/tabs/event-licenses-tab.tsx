"use client"

import type React from "react"

import { useState } from "react"
import {
  FileCheck,
  FileClock,
  FileWarning,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Edit,
  ClipboardCheck,
  Building,
  Utensils,
  Music,
  Users,
  Truck,
  ShieldCheck,
  Zap,
  Tent,
} from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventLicensesTabProps {
  event: Event
}

// License type definition
type License = {
  id: string
  name: string
  type: string
  description: string
  status: "approved" | "pending" | "missing" | "rejected"
  dueDate: string
  issuingAuthority: string
  applicationDate?: string
  approvalDate?: string
  rejectionReason?: string
  cost: number
  icon: React.ElementType
  requiredFields: {
    name: string
    type: "text" | "email" | "tel" | "textarea" | "date" | "file" | "number"
    required: boolean
    description?: string
  }[]
  documents: {
    name: string
    uploaded: boolean
    url?: string
  }[]
  notes?: string
}

export function EventLicensesTab({ event }: EventLicensesTabProps) {
  // Mock licenses data
  const licenses: License[] = [
    {
      id: "venue-permit",
      name: "Venue Permit",
      type: "Venue",
      description: "Official authorization to use the venue for your event. Required for all public gatherings.",
      status: "approved",
      dueDate: "2025-02-15",
      issuingAuthority: "City Planning Department",
      applicationDate: "2025-01-10",
      approvalDate: "2025-01-25",
      cost: 350,
      icon: Building,
      requiredFields: [
        { name: "Applicant Name", type: "text", required: true },
        { name: "Business Name", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Venue Address", type: "textarea", required: true },
        { name: "Event Date", type: "date", required: true },
        { name: "Expected Attendance", type: "number", required: true },
        { name: "Event Description", type: "textarea", required: true },
      ],
      documents: [
        { name: "Floor Plan", uploaded: true, url: "#" },
        { name: "Insurance Certificate", uploaded: true, url: "#" },
        { name: "Business License", uploaded: true, url: "#" },
      ],
      notes: "Approved with condition to maintain noise levels below city ordinance limits after 10 PM.",
    },
    {
      id: "alcohol-license",
      name: "Alcohol License",
      type: "Food & Beverage",
      description: "Temporary permit to serve alcoholic beverages at your event.",
      status: "approved",
      dueDate: "2025-02-20",
      issuingAuthority: "State Liquor Control Board",
      applicationDate: "2025-01-15",
      approvalDate: "2025-02-05",
      cost: 500,
      icon: Utensils,
      requiredFields: [
        { name: "Business Name", type: "text", required: true },
        { name: "License Holder Name", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Event Address", type: "textarea", required: true },
        { name: "Service Start Date", type: "date", required: true },
        { name: "Service End Date", type: "date", required: true },
        { name: "Types of Alcohol", type: "textarea", required: true },
      ],
      documents: [
        { name: "Business License", uploaded: true, url: "#" },
        { name: "Responsible Server Certificates", uploaded: true, url: "#" },
        { name: "Site Plan", uploaded: true, url: "#" },
      ],
    },
    {
      id: "food-permit",
      name: "Food Service Permit",
      type: "Food & Beverage",
      description: "Health department authorization for serving food at your event.",
      status: "pending",
      dueDate: "2025-02-25",
      issuingAuthority: "County Health Department",
      applicationDate: "2025-02-01",
      cost: 250,
      icon: Utensils,
      requiredFields: [
        { name: "Business Name", type: "text", required: true },
        { name: "Contact Person", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Event Address", type: "textarea", required: true },
        { name: "Service Date(s)", type: "date", required: true },
        { name: "Number of Food Handlers", type: "number", required: true },
        { name: "Types of Food", type: "textarea", required: true },
      ],
      documents: [
        { name: "Food Handler Certificates", uploaded: true, url: "#" },
        { name: "Menu Items", uploaded: true, url: "#" },
        { name: "Food Source Documentation", uploaded: false },
      ],
    },
    {
      id: "fire-safety",
      name: "Fire Safety Inspection",
      type: "Safety",
      description: "Mandatory fire department inspection for event safety compliance.",
      status: "pending",
      dueDate: "2025-03-01",
      issuingAuthority: "City Fire Department",
      applicationDate: "2025-02-05",
      cost: 200,
      icon: ShieldCheck,
      requiredFields: [
        { name: "Venue Name", type: "text", required: true },
        { name: "Contact Person", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Venue Address", type: "textarea", required: true },
        { name: "Inspection Date", type: "date", required: true },
        { name: "Venue Capacity", type: "number", required: true },
        {
          name: "Special Effects/Pyrotechnics",
          type: "textarea",
          required: false,
          description: "Describe any special effects or pyrotechnics planned for the event",
        },
      ],
      documents: [
        { name: "Floor Plan", uploaded: true, url: "#" },
        { name: "Exit Plan", uploaded: true, url: "#" },
        { name: "Equipment List", uploaded: false },
      ],
    },
    {
      id: "noise-permit",
      name: "Noise Permit",
      type: "Entertainment",
      description: "Permission to exceed normal noise regulations during your event.",
      status: "missing",
      dueDate: "2025-03-05",
      issuingAuthority: "City Environmental Services",
      cost: 150,
      icon: Music,
      requiredFields: [
        { name: "Applicant Name", type: "text", required: true },
        { name: "Organization", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Event Location", type: "textarea", required: true },
        { name: "Event Date", type: "date", required: true },
        { name: "Start Time", type: "text", required: true },
        { name: "End Time", type: "text", required: true },
        { name: "Sound Equipment Details", type: "textarea", required: true },
      ],
      documents: [
        { name: "Site Plan", uploaded: false },
        { name: "Equipment Specifications", uploaded: false },
      ],
    },
    {
      id: "public-assembly",
      name: "Public Assembly Permit",
      type: "Safety",
      description: "Required for events with large gatherings in public spaces.",
      status: "missing",
      dueDate: "2025-03-10",
      issuingAuthority: "City Public Safety Department",
      cost: 300,
      icon: Users,
      requiredFields: [
        { name: "Organizer Name", type: "text", required: true },
        { name: "Organization", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Assembly Location", type: "textarea", required: true },
        { name: "Event Date", type: "date", required: true },
        { name: "Expected Attendance", type: "number", required: true },
        { name: "Security Plan", type: "textarea", required: true },
      ],
      documents: [
        { name: "Site Plan", uploaded: false },
        { name: "Security Contract", uploaded: false },
        { name: "Insurance Certificate", uploaded: false },
      ],
    },
    {
      id: "parking-permit",
      name: "Special Parking Permit",
      type: "Logistics",
      description: "Authorization for reserved or special parking arrangements.",
      status: "rejected",
      dueDate: "2025-02-28",
      issuingAuthority: "City Transportation Department",
      applicationDate: "2025-02-10",
      rejectionReason:
        "Insufficient information provided about traffic management plan. Please resubmit with detailed traffic flow diagrams.",
      cost: 175,
      icon: Truck,
      requiredFields: [
        { name: "Applicant Name", type: "text", required: true },
        { name: "Organization", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Parking Location", type: "textarea", required: true },
        { name: "Event Date", type: "date", required: true },
        { name: "Number of Spaces", type: "number", required: true },
        { name: "Hours Needed", type: "text", required: true },
        { name: "Traffic Management Plan", type: "textarea", required: true },
      ],
      documents: [
        { name: "Site Map", uploaded: true, url: "#" },
        { name: "Traffic Flow Diagram", uploaded: false },
      ],
    },
    {
      id: "tent-permit",
      name: "Temporary Structure Permit",
      type: "Venue",
      description: "Required for setting up tents, stages, or other temporary structures.",
      status: "approved",
      dueDate: "2025-02-18",
      issuingAuthority: "City Building Department",
      applicationDate: "2025-01-25",
      approvalDate: "2025-02-10",
      cost: 225,
      icon: Tent,
      requiredFields: [
        { name: "Applicant Name", type: "text", required: true },
        { name: "Organization", type: "text", required: true },
        { name: "Contact Email", type: "email", required: true },
        { name: "Contact Phone", type: "tel", required: true },
        { name: "Installation Location", type: "textarea", required: true },
        { name: "Installation Date", type: "date", required: true },
        { name: "Removal Date", type: "date", required: true },
        { name: "Structure Dimensions", type: "textarea", required: true },
      ],
      documents: [
        { name: "Structural Plans", uploaded: true, url: "#" },
        { name: "Fire Retardant Certification", uploaded: true, url: "#" },
        { name: "Insurance Certificate", uploaded: true, url: "#" },
      ],
    },
  ]

  // State for expanded license
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter licenses based on search query and active filter
  const filteredLicenses = licenses.filter((license) => {
    const matchesSearch =
      license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeFilter === "venue") return license.type === "Venue"
    if (activeFilter === "food") return license.type === "Food & Beverage"
    if (activeFilter === "safety") return license.type === "Safety"
    if (activeFilter === "entertainment") return license.type === "Entertainment"
    if (activeFilter === "logistics") return license.type === "Logistics"

    return true
  })

  // Licenses by status
  const approvedLicenses = filteredLicenses.filter((license) => license.status === "approved")
  const pendingLicenses = filteredLicenses.filter((license) => license.status === "pending")
  const missingLicenses = filteredLicenses.filter((license) => license.status === "missing")
  const rejectedLicenses = filteredLicenses.filter((license) => license.status === "rejected")

  // Get status badge
  const getStatusBadge = (status: "approved" | "pending" | "missing" | "rejected") => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-50">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
            <AlertCircle className="mr-1 h-3 w-3" />
            Missing
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
    }
  }

  // Calculate total cost
  const totalCost = licenses.reduce((sum, license) => sum + license.cost, 0)
  const paidCost = approvedLicenses.reduce((sum, license) => sum + license.cost, 0)

  // License card component
  const LicenseCard = ({ license }: { license: License }) => {
    const isExpanded = expandedLicense === license.id

    return (
      <Card className={`overflow-hidden transition-all ${isExpanded ? "shadow-md" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-full p-2 ${
                  license.status === "approved"
                    ? "bg-green-50 text-green-600"
                    : license.status === "pending"
                      ? "bg-yellow-50 text-yellow-600"
                      : license.status === "rejected"
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-50 text-gray-600"
                }`}
              >
                <license.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">{license.name}</CardTitle>
                <CardDescription>{license.type}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(license.status)}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setExpandedLicense(isExpanded ? null : license.id)}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <>
            <CardContent className="pb-3">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{license.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Issuing Authority:</span>{" "}
                    <span className="font-medium">{license.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>{" "}
                    <span className="font-medium">{new Date(license.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost:</span>{" "}
                    <span className="font-medium">${license.cost.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Required Documents:</span>{" "}
                    <span className="font-medium">{license.documents.length}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Application Progress</span>
                    <span className="font-medium">
                      {license.status === "approved"
                        ? "100%"
                        : license.status === "pending"
                          ? "75%"
                          : license.status === "rejected"
                            ? "50%"
                            : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={
                      license.status === "approved"
                        ? 100
                        : license.status === "pending"
                          ? 75
                          : license.status === "rejected"
                            ? 50
                            : 0
                    }
                    className="h-2"
                  />
                </div>

                {/* Required Fields Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Required Information:</h4>
                  <div className="rounded-md border p-3">
                    <ul className="space-y-1 text-sm">
                      {license.requiredFields.map((field, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span>•</span>
                          <span>
                            <span className="font-medium">{field.name}</span>
                            {field.required && <span className="text-red-500">*</span>}
                            {field.description && (
                              <span className="block text-xs text-muted-foreground">{field.description}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Required Documents Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Required Documents:</h4>
                  <div className="rounded-md border p-3">
                    <ul className="space-y-2 text-sm">
                      {license.documents.map((doc, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{doc.name}</span>
                          {doc.uploaded ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Uploaded
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Required
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {license.notes && (
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <p className="font-medium">Notes:</p>
                    <p>{license.notes}</p>
                  </div>
                )}

                {license.rejectionReason && (
                  <div className="rounded-md bg-red-50 p-3 text-sm border border-red-200 text-red-700">
                    <p className="font-medium">Rejection Reason:</p>
                    <p>{license.rejectionReason}</p>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-0">
              {license.status === "approved" ? (
                <Button size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              ) : license.status === "rejected" ? (
                <Button size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Resubmit
                </Button>
              ) : license.status === "missing" ? (
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Apply
                </Button>
              ) : (
                <Button size="sm" className="gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Submit
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* License details dialog */}

      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Licenses & Permits</h2>
          <p className="text-muted-foreground">Manage all legal requirements for your event</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Add License
          </Button>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{licenses.length}</div>
                <p className="text-xs text-muted-foreground">Required for this event</p>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-primary" />
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-50 p-2 dark:bg-green-900/20">
                <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {approvedLicenses.length}
                  </span>
                  <Badge className="bg-green-500">
                    {Math.round((approvedLicenses.length / licenses.length) * 100)}%
                  </Badge>
                </div>
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
                <FileClock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {pendingLicenses.length}
                  </span>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    {Math.round((pendingLicenses.length / licenses.length) * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-yellow-500" />
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-50 p-2 dark:bg-red-900/20">
                <FileWarning className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">{missingLicenses.length}</span>
                  <Badge variant="destructive">{Math.round((missingLicenses.length / licenses.length) * 100)}%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-red-500" />
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">${paidCost.toFixed(2)} paid</p>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-blue-500" />
        </Card>
      </div>

      {/* License management tools */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>License Tracker</CardTitle>
              <CardDescription>Track all permits and licenses for your event</CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search licenses..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={activeFilter || "all"}
                onValueChange={(value) => setActiveFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
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
                All Licenses
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Approved
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="missing"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Missing
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {filteredLicenses.map((license) => (
                  <LicenseCard key={license.id} license={license} />
                ))}

                {filteredLicenses.length === 0 && (
                  <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <FileWarning className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No licenses found</h3>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="grid gap-4">
                {approvedLicenses.map((license) => (
                  <LicenseCard key={license.id} license={license} />
                ))}

                {approvedLicenses.length === 0 && (
                  <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <FileCheck className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No approved licenses</h3>
                      <p className="text-sm text-muted-foreground">Submit applications to get approvals</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-4">
                {pendingLicenses.map((license) => (
                  <LicenseCard key={license.id} license={license} />
                ))}

                {pendingLicenses.length === 0 && (
                  <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <FileClock className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No pending licenses</h3>
                      <p className="text-sm text-muted-foreground">All applications have been processed</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="missing" className="space-y-4">
              <div className="grid gap-4">
                {missingLicenses.map((license) => (
                  <LicenseCard key={license.id} license={license} />
                ))}

                {missingLicenses.length === 0 && (
                  <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <FileWarning className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No missing licenses</h3>
                      <p className="text-sm text-muted-foreground">All required licenses have been applied for</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <div className="grid gap-4">
                {rejectedLicenses.map((license) => (
                  <LicenseCard key={license.id} license={license} />
                ))}

                {rejectedLicenses.length === 0 && (
                  <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <X className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No rejected licenses</h3>
                      <p className="text-sm text-muted-foreground">All applications are in good standing</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="py-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLicenses.length} of {licenses.length} licenses
            </div>
            <Button variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              Add License
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

