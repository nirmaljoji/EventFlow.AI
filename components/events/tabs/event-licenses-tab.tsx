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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

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
  const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false)
  const [isEditLicenseOpen, setIsEditLicenseOpen] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)
  const [editLicenseForm, setEditLicenseForm] = useState({
    name: "",
    type: "",
    description: "",
    status: "missing" as "approved" | "pending" | "missing" | "rejected",
    dueDate: "",
    issuingAuthority: "",
    cost: "",
    notes: "",
    documents: [] as { name: string; uploaded: boolean; url?: string }[],
  })
  const [addLicenseForm, setAddLicenseForm] = useState({
    name: "",
    type: "",
    description: "",
    status: "missing" as const,
    dueDate: "",
    issuingAuthority: "",
    cost: "",
    notes: "",
  })

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

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = [
        "Name",
        "Type",
        "Status",
        "Issuing Authority",
        "Due Date",
        "Cost",
        "Description",
        "Notes"
      ]
      
      const rows = licenses.map(license => [
        license.name,
        license.type,
        license.status,
        license.issuingAuthority,
        new Date(license.dueDate).toLocaleDateString(),
        license.cost.toFixed(2),
        license.description,
        license.notes || ""
      ])

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n")

      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `event-licenses-${event.title.toLowerCase().replace(/\s+/g, "-")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "Licenses exported successfully",
      })
    } catch (error) {
      console.error("Error exporting licenses:", error)
      toast({
        title: "Error",
        description: "Failed to export licenses. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddLicenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAddLicenseForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...addLicenseForm,
          eventId: event.id,
          cost: parseFloat(addLicenseForm.cost),
          requiredFields: [],
          documents: [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create license")
      }

      toast({
        title: "Success",
        description: "License added successfully",
      })

      // Reset form
      setAddLicenseForm({
        name: "",
        type: "",
        description: "",
        status: "missing",
        dueDate: "",
        issuingAuthority: "",
        cost: "",
        notes: "",
      })

      // Close dialog
      setIsAddLicenseOpen(false)

      // Refresh licenses list
      const fetchLicenses = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          if (!response.ok) {
            throw new Error("Failed to fetch licenses")
          }
          const data = await response.json()
          
          const processedLicenses = data.licenses.map((license: any) => ({
            ...license,
            icon: getIconForLicenseType(license.type),
          }))
          
          setLicenses(processedLicenses)
          setError(null)
        } catch (err) {
          setError("Failed to load licenses")
          console.error("Error fetching licenses:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchLicenses()
    } catch (error) {
      console.error("Error adding license:", error)
      toast({
        title: "Error",
        description: "Failed to add license. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // Handle opening the edit dialog
  const handleEditDialogOpen = (license: License) => {
    setSelectedLicense(license)
    setEditLicenseForm({
      name: license.name,
      type: license.type,
      description: license.description,
      status: license.status,
      dueDate: license.dueDate ? new Date(license.dueDate).toISOString().split('T')[0] : "",
      issuingAuthority: license.issuingAuthority,
      cost: license.cost.toString(),
      notes: license.notes || "",
      documents: [...license.documents]
    })
    setIsEditLicenseOpen(true)
  }

  // Handle edit license form change
  const handleEditLicenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditLicenseForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle saving the edited license
  const handleEditLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLicense) return

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses/${selectedLicense.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...selectedLicense,
          name: editLicenseForm.name,
          type: editLicenseForm.type,
          description: editLicenseForm.description,
          status: editLicenseForm.status,
          dueDate: editLicenseForm.dueDate,
          issuingAuthority: editLicenseForm.issuingAuthority,
          cost: parseFloat(editLicenseForm.cost),
          notes: editLicenseForm.notes,
          requiredFields: selectedLicense.requiredFields,
          documents: editLicenseForm.documents,
          eventId: event.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update license")
      }

      toast({
        title: "Success",
        description: "License updated successfully",
      })

      // Close dialog
      setIsEditLicenseOpen(false)
      setSelectedLicense(null)

      // Refresh licenses list
      const fetchLicenses = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          if (!response.ok) {
            throw new Error("Failed to fetch licenses")
          }
          const data = await response.json()
          
          const processedLicenses = data.licenses.map((license: any) => ({
            ...license,
            icon: getIconForLicenseType(license.type),
          }))
          
          setLicenses(processedLicenses)
          setError(null)
        } catch (err) {
          setError("Failed to load licenses")
          console.error("Error fetching licenses:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchLicenses()
    } catch (error) {
      console.error("Error updating license:", error)
      toast({
        title: "Error",
        description: "Failed to update license. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // Handle adding a new document to the form
  const handleAddDocument = () => {
    setEditLicenseForm((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        { name: "", uploaded: false }
      ]
    }))
  }

  // Handle removing a document from the form
  const handleRemoveDocument = (index: number) => {
    setEditLicenseForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  // Handle document field changes
  const handleDocumentChange = (index: number, field: string, value: any) => {
    setEditLicenseForm((prev) => {
      const newDocuments = [...prev.documents]
      newDocuments[index] = {
        ...newDocuments[index],
        [field]: value
      }
      return {
        ...prev,
        documents: newDocuments
      }
    })
  }

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
    const [isEditing, setIsEditing] = useState(false)
    const [editedLicense, setEditedLicense] = useState<Partial<License>>({})

    const handleEdit = () => {
      setEditedLicense({
        name: license.name,
        type: license.type,
        description: license.description,
        status: license.status,
        dueDate: license.dueDate,
        issuingAuthority: license.issuingAuthority,
        cost: license.cost,
        notes: license.notes || "",
      })
      setIsEditing(true)
    }

    const handleCancel = () => {
      setIsEditing(false)
      setEditedLicense({})
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setEditedLicense((prev) => ({ ...prev, [name]: value }))
    }

    const handleStatusChange = (value: "approved" | "pending" | "missing" | "rejected") => {
      setEditedLicense((prev) => ({ ...prev, status: value }))
    }

    const handleSave = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses/${license.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...license,
            ...editedLicense,
            cost: typeof editedLicense.cost === 'string' ? parseFloat(editedLicense.cost as string) : editedLicense.cost,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to update license")
        }

        toast({
          title: "Success",
          description: "License updated successfully",
        })

        // Refresh licenses list
        const fetchLicenses = async () => {
          try {
            const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses`, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            if (!response.ok) {
              throw new Error("Failed to fetch licenses")
            }
            const data = await response.json()
            
            const processedLicenses = data.licenses.map((license: any) => ({
              ...license,
              icon: getIconForLicenseType(license.type),
            }))
            
            setLicenses(processedLicenses)
            setError(null)
          } catch (err) {
            setError("Failed to load licenses")
            console.error("Error fetching licenses:", err)
          } finally {
            setLoading(false)
          }
        }

        fetchLicenses()
        setIsEditing(false)
      } catch (error) {
        console.error("Error updating license:", error)
        toast({
          title: "Error",
          description: "Failed to update license. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

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
                {isEditing ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`name-${license.id}`}>License Name</Label>
                      <Input
                        id={`name-${license.id}`}
                        name="name"
                        value={editedLicense.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`type-${license.id}`}>Type</Label>
                      <Select
                        value={editedLicense.type}
                        onValueChange={(value) => setEditedLicense((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger id={`type-${license.id}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Venue">Venue</SelectItem>
                          <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                          <SelectItem value="Safety">Safety</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Logistics">Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`status-${license.id}`}>Status</Label>
                      <Select
                        value={editedLicense.status}
                        onValueChange={(value: any) => handleStatusChange(value)}
                      >
                        <SelectTrigger id={`status-${license.id}`}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Approved</span>
                          </SelectItem>
                          <SelectItem value="pending" className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span>Pending</span>
                          </SelectItem>
                          <SelectItem value="missing" className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span>Missing</span>
                          </SelectItem>
                          <SelectItem value="rejected" className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span>Rejected</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`description-${license.id}`}>Description</Label>
                      <Textarea
                        id={`description-${license.id}`}
                        name="description"
                        value={editedLicense.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`issuingAuthority-${license.id}`}>Issuing Authority</Label>
                      <Input
                        id={`issuingAuthority-${license.id}`}
                        name="issuingAuthority"
                        value={editedLicense.issuingAuthority}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`dueDate-${license.id}`}>Due Date</Label>
                      <Input
                        id={`dueDate-${license.id}`}
                        name="dueDate"
                        type="date"
                        value={editedLicense.dueDate ? new Date(editedLicense.dueDate).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`cost-${license.id}`}>Cost ($)</Label>
                      <Input
                        id={`cost-${license.id}`}
                        name="cost"
                        type="number"
                        step="0.01"
                        value={editedLicense.cost}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`notes-${license.id}`}>Notes</Label>
                      <Textarea
                        id={`notes-${license.id}`}
                        name="notes"
                        value={editedLicense.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-0">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEditDialogOpen(license)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
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
                </>
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
          <Button variant="outline" className="gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1" onClick={() => setIsAddLicenseOpen(true)}>
            <Plus className="h-4 w-4" />
            Add License
          </Button>
        </div>
      </div>

      {/* Add License Dialog */}
      <Dialog open={isAddLicenseOpen} onOpenChange={setIsAddLicenseOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add New License</DialogTitle>
            <DialogDescription>
              Add a new license or permit required for your event.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-1 my-1 flex-grow">
            <form id="add-license-form" onSubmit={handleAddLicenseSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">License Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={addLicenseForm.name}
                  onChange={handleAddLicenseChange}
                  placeholder="e.g., Special Event Permit"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={addLicenseForm.type}
                  onValueChange={(value) => setAddLicenseForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Venue">Venue</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={addLicenseForm.description}
                  onChange={handleAddLicenseChange}
                  placeholder="Describe the license requirements..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  name="issuingAuthority"
                  value={addLicenseForm.issuingAuthority}
                  onChange={handleAddLicenseChange}
                  placeholder="e.g., City Council"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={addLicenseForm.dueDate}
                  onChange={handleAddLicenseChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={addLicenseForm.cost}
                  onChange={handleAddLicenseChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={addLicenseForm.notes}
                  onChange={handleAddLicenseChange}
                  placeholder="Additional notes..."
                />
              </div>
            </form>
          </div>
          <DialogFooter className="flex-shrink-0 pt-2 mt-2 border-t">
            <Button variant="outline" type="button" onClick={() => setIsAddLicenseOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" form="add-license-form" disabled={loading}>
              {loading ? "Adding..." : "Add License"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit License Dialog */}
      <Dialog open={isEditLicenseOpen} onOpenChange={setIsEditLicenseOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit License</DialogTitle>
            <DialogDescription>
              Edit the details of the license.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-1 my-1 flex-grow">
            <form id="edit-license-form" onSubmit={handleEditLicenseSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">License Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editLicenseForm.name}
                  onChange={handleEditLicenseChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={editLicenseForm.type}
                  onValueChange={(value) => setEditLicenseForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Venue">Venue</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editLicenseForm.description}
                  onChange={handleEditLicenseChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editLicenseForm.status}
                  onValueChange={(value) => setEditLicenseForm((prev) => ({ ...prev, status: value as "approved" | "pending" | "missing" | "rejected" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Approved</span>
                    </SelectItem>
                    <SelectItem value="pending" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span>Pending</span>
                    </SelectItem>
                    <SelectItem value="missing" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Missing</span>
                    </SelectItem>
                    <SelectItem value="rejected" className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500" />
                      <span>Rejected</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={editLicenseForm.dueDate}
                  onChange={handleEditLicenseChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  name="issuingAuthority"
                  value={editLicenseForm.issuingAuthority}
                  onChange={handleEditLicenseChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={editLicenseForm.cost}
                  onChange={handleEditLicenseChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={editLicenseForm.notes}
                  onChange={handleEditLicenseChange}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Documents</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddDocument}
                    className="h-8 px-2 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Document
                  </Button>
                </div>
                <div className="rounded-md border p-3 space-y-3">
                  {editLicenseForm.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No documents added yet</p>
                  ) : (
                    editLicenseForm.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="flex-1">
                          <Input
                            placeholder="Document name"
                            value={doc.name}
                            onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                            className="mb-1"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                id={`uploaded-${index}`}
                                checked={doc.uploaded}
                                onChange={(e) => handleDocumentChange(index, 'uploaded', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary"
                              />
                              <label htmlFor={`uploaded-${index}`} className="text-xs">
                                Marked as uploaded
                              </label>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDocument(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </form>
          </div>
          <DialogFooter className="flex-shrink-0 pt-2 mt-2 border-t">
            <Button variant="outline" type="button" onClick={() => setIsEditLicenseOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" form="edit-license-form" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

