"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function EventLicensesTab({ event }: EventLicensesTabProps) {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch licenses from backend
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true)
        // Get token from localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch licenses')
        }
        const data = await response.json()
        
        // Map backend data to frontend License type with icons
        const processedLicenses = data.licenses.map((license: any) => ({
          ...license,
          icon: getIconForLicenseType(license.type)
        }))
        
        setLicenses(processedLicenses)
        setError(null)
      } catch (err) {
        setError('Failed to load licenses')
        console.error('Error fetching licenses:', err)
      } finally {
        setLoading(false)
      }
    }

    if (event.id) {
      fetchLicenses()
    }
  }, [event.id])

  // Helper function to get icon based on license type
  const getIconForLicenseType = (type: string): React.ElementType => {
    switch (type) {
      case "Venue":
        return Building
      case "Food & Beverage":
        return Utensils
      case "Safety":
        return ShieldCheck
      case "Entertainment":
        return Music
      case "Logistics":
        return Truck
      default:
        return FileCheck
    }
  }

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

  // Calculate total cost
  const totalCost = licenses.reduce((sum, license) => sum + license.cost, 0)
  const paidCost = approvedLicenses.reduce((sum, license) => sum + license.cost, 0)

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading licenses...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="mt-4 text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

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
        <Card className="overflow-hidden flex flex-col">
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
          <div className="h-2 w-full bg-primary mt-auto" />
        </Card>

        <Card className="overflow-hidden flex flex-col">
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
          <div className="h-2 w-full bg-green-500 mt-auto" />
        </Card>

        <Card className="overflow-hidden flex flex-col">
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
          <div className="h-2 w-full bg-yellow-500 mt-auto" />
        </Card>

        <Card className="overflow-hidden flex flex-col">
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
          <div className="h-2 w-full bg-red-500 mt-auto" />
        </Card>

        <Card className="overflow-hidden flex flex-col">
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
          <div className="h-2 w-full bg-blue-500 mt-auto" />
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

