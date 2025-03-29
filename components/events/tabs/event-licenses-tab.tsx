"use client"

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
import type { Event, Vendor } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"
import type React from "react"

interface License {
name: string
type: string
expiry_date: string
status: string
issue_date: string
issued_by: string
}

interface LicenseSummary {
  total_licenses: number
total_permits: number
status:string
last_updated: string
} 

interface Permit {
  name: string
type: string
expiry_date: string
status: string
issue_date: string
issued_by: string
}

interface EventLicensesData {
  summary: LicenseSummary
  licenses:License[]
  permits: Permit[]
}

interface EventLicensesTabProps{
  event: Event
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function EventLicensesTab({ event }: EventLicensesTabProps) {
  const { toast } = useToast()
  const [licenseData, setLicenseData] = useState<EventLicensesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const event_id = localStorage.getItem("event_id")

  // Dialog states
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false)
  const [permitDialogOpen, setPermitDialogOpen] = useState(false)

  // Form states
  const [newLicense, setNewLicense] = useState<License>({
    name: "",
    type: "Beverage",
    expiry_date: "",
    status: "Pending",
    issue_date: "",
    issued_by: ""
  })

  const [newPermit, setNewPermit] = useState<Permit>({
    name: "",
    type: "Environmental",
    expiry_date: "",
    status: "Approved",
    issue_date: "",
    issued_by: ""
  })

  // Edit mode tracking states
  const [isEditingLicense, setIsEditingLicense] = useState(false)
  const [editingLicenseIndex, setEditingLicenseIndex] = useState<number | null>(null)
  const [isEditingPermit, setIsEditingPermit] = useState(false)
  const [editingPermitIndex, setEditingPermitIndex] = useState<number | null>(null)

  // Get token from local storage
  const getToken = () => {
    return localStorage.getItem("token")
  }

  // Fetch licenses for the event
  const fetchlicenseData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Fetch license summary
      const summaryResponse = await fetch(`${apiUrl}/api/events/${event_id}/licenses`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      console.log(summaryResponse)

      // if (!summaryResponse.ok) {
      //   if (summaryResponse.status === 401 || summaryResponse.status === 403) {
      //     throw new Error("You are not authorized to view this event's license details")
      //   }
      //   throw new Error("Failed to fetch license data")
      // }

      const summaryData = await summaryResponse.json()
      
      // Fetch licenses
      const licensesResponse = await fetch(`${apiUrl}/api/events/${event_id}/licenses`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!licensesResponse.ok) {
        throw new Error("Failed to fetch licenses")
      }
      
      const licenses = await licensesResponse.json()
      
      // Fetch permits
      const permitsResponse = await fetch(`${apiUrl}/api/events/${event_id}/permits`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!permitsResponse.ok) {
        throw new Error("Failed to fetch permits")
      }
      
      const permits = await permitsResponse.json()

      setLicenseData({
        summary: summaryData,
        licenses: licenses,
        permits: permits
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load license data"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (event_id) {
      fetchlicenseData()
    }
  }, [event_id])

  // Function to format last updated date
  const formatLastUpdated = (dateString: string) => {
    try {
      return `Last updated ${formatDistanceToNow(new Date(dateString), { addSuffix: true })}`
    } catch (err) {
      return "Last updated recently"
    }
  }

  // Function to handle editing menu item
  const handleEditLicense = (index: number) => {
    if (licenseData) {
      setNewLicense({...licenseData.licenses[index]})
      setIsEditingLicense(true)
      setEditingLicenseIndex(index)
      setLicenseDialogOpen(true)
    }
  }

  // Function to handle editing beverage
  const handleEditPermit = (index: number) => {
    if (licenseData) {
      setNewPermit({...licenseData.permits[index]})
      setIsEditingPermit(true)
      setEditingPermitIndex(index)
      setPermitDialogOpen(true)
    }
  }

  // Reset form function for menu items
  const resetLicenseForm = () => {
    setNewLicense({
      name: "",
      type: "Beverage",
      expiry_date: "",
      status: "Pending",
      issue_date: "",
      issued_by: ""
    })
    setIsEditingLicense(false)
    setEditingLicenseIndex(null)
  }

  // Reset form function for beverages
  const resetPermitForm = () => {
    setNewPermit({
      name: "",
      type: "Environmental",
      expiry_date: "",
      status: "Approved",
      issue_date: "",
      issued_by: ""
    })
    setIsEditingPermit(false)
    setEditingPermitIndex(null)
  }
  // CRUD operations for license
  const handleAddLicense = async () => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      if (isEditingLicense && editingLicenseIndex !== null) {
        // Update existing menu item
        const response = await fetch(`${apiUrl}/api/events/${event_id}/license/${editingLicenseIndex}`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newLicense)
        })
        
        if (!response.ok) {
          throw new Error("Failed to update license")
        }
        
        toast({
          title: "Success",
          description: "License updated successfully"
        })
      } else {
        // Add new licese
        const response = await fetch(`${apiUrl}/api/events/${event_id}/license`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newLicense)
        })
        
        if (!response.ok) {
          throw new Error("Failed to add license")
        }
        
        toast({
          title: "Success",
          description: "License added successfully"
        })
      }
      
      // Refresh data
      fetchlicenseData()
      
      // Reset form and close dialog
      resetLicenseForm()
      setLicenseDialogOpen(false)
      
    } catch (err) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to process license"
      })
    }
  }

  const handleDeleteLicense = async (index: number) => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      const response = await fetch(`${apiUrl}/api/events/${event_id}/license/${index}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete license")
      }
      
      // Refresh data
      fetchlicenseData()
      
      toast({
        title: "Success",
        description: "License deleted successfully"
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete license"
      })
    }
  }

  // CRUD operations for permits
  const handleAddpermit = async () => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      if (isEditingPermit && editingPermitIndex !== null) {
        // Update existing beverage
        const response = await fetch(`${apiUrl}/api/events/${event_id}/permit/${editingPermitIndex}`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newPermit)
        })
        
        if (!response.ok) {
          throw new Error("Failed to update permit")
        }
        
        toast({
          title: "Success",
          description: "Permit updated successfully"
        })
      } else {
        // Add new beverage
        const response = await fetch(`${apiUrl}/api/events/${event_id}/permit`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newPermit)
        })
        
        if (!response.ok) {
          throw new Error("Failed to add permit")
        }
        
        toast({
          title: "Success",
          description: "Permit added successfully"
        })
      }
      
      // Refresh data
      fetchlicenseData()
      
      // Reset form and close dialog
      resetPermitForm()
      setPermitDialogOpen(false)
      
    } catch (err) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to process permit"
      })
    }
  }

  const handleDeletePermit = async (index: number) => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      const response = await fetch(`${apiUrl}/api/events/${event_id}/permit/${index}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete permit")
      }
      
      // Refresh data
      fetchlicenseData()
      
      toast({
        title: "Success",
        description: "Permit deleted successfully"
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete permit"
      })
    }
  }
  // Handle dialog close for menu items
  const handleLicenseDialogClose = () => {
    resetLicenseForm()
    setLicenseDialogOpen(false)
  }

  // Handle dialog close for beverages
  const handlePermitDialogClose = () => {
    resetPermitForm()
    setPermitDialogOpen(false)
  }

  // If loading or no data
  // if (loading) {
  //   return <div className="p-8 text-center">Loading license information...</div>
  // }

  if (error || !licenseData) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || "Unable to load license information"}</p>
        <Button onClick={fetchlicenseData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Licenses & Permits</h2>
          <p className="text-muted-foreground">Manage all legal requirements for your event</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setLicenseDialogOpen(true)} className="gap-1">
            <Plus className="h-4 w-4" />
            Add License
          </Button>
          <Button onClick={() => setPermitDialogOpen(true)} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Permit
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseData.summary.total_licenses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Permits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseData.summary.total_permits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {formatLastUpdated(licenseData.summary.last_updated)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Licenses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {licenseData.licenses.map((license, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{license.name}</h3>
                  <p className="text-sm text-muted-foreground">{license.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={license.status === "Approved" ? "default" : "secondary"}>
                    {license.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEditLicense(index)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteLicense(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Permits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {licenseData.permits.map((permit, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{permit.name}</h3>
                  <p className="text-sm text-muted-foreground">{permit.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={permit.status === "Approved" ? "default" : "secondary"}>
                    {permit.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEditPermit(index)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePermit(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* License Dialog */}
      <Dialog open={licenseDialogOpen} onOpenChange={setLicenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingLicense ? "Edit License" : "Add License"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newLicense.name}
                onChange={(e) => setNewLicense({ ...newLicense, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newLicense.type}
                onValueChange={(value) => setNewLicense({ ...newLicense, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="License">License</SelectItem>
                  <SelectItem value="Permit">Permit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={newLicense.expiry_date}
                onChange={(e) => setNewLicense({ ...newLicense, expiry_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={newLicense.issue_date}
                onChange={(e) => setNewLicense({ ...newLicense, issue_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issued_by">Issued By</Label>
              <Input
                id="issued_by"
                value={newLicense.issued_by}
                onChange={(e) => setNewLicense({ ...newLicense, issued_by: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleLicenseDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleAddLicense}>
              {isEditingLicense ? "Update" : "Add"} License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permit Dialog */}
      <Dialog open={permitDialogOpen} onOpenChange={setPermitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingPermit ? "Edit Permit" : "Add Permit"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="permit-name">Name</Label>
              <Input
                id="permit-name"
                value={newPermit.name}
                onChange={(e) => setNewPermit({ ...newPermit, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permit-type">Type</Label>
              <Select
                value={newPermit.type}
                onValueChange={(value) => setNewPermit({ ...newPermit, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Environmental">Environmental</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="permit-expiry_date">Expiry Date</Label>
              <Input
                id="permit-expiry_date"
                type="date"
                value={newPermit.expiry_date}
                onChange={(e) => setNewPermit({ ...newPermit, expiry_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permit-issue_date">Issue Date</Label>
              <Input
                id="permit-issue_date"
                type="date"
                value={newPermit.issue_date}
                onChange={(e) => setNewPermit({ ...newPermit, issue_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permit-issued_by">Issued By</Label>
              <Input
                id="permit-issued_by"
                value={newPermit.issued_by}
                onChange={(e) => setNewPermit({ ...newPermit, issued_by: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handlePermitDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleAddpermit}>
              {isEditingPermit ? "Update" : "Add"} Permit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
