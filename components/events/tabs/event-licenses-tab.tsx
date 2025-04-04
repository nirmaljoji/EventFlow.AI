"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { LicensesHeader } from "./licenses/LicensesHeader"
import { AddLicenseDialog } from "./licenses/AddLicenseDialog"
import { EditLicenseDialog } from "./licenses/EditLicenseDialog"
import { LicenseStatsCards } from "./licenses/LicenseStatsCards"
import { LicenseManagementTools } from "./licenses/LicenseManagementTools"
import { LicenseCard } from "./licenses/LicenseCard" // Import the new LicenseCard
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
import type { Event, License } from "@/lib/types"
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
import { useLicenses } from "@/hooks/use-licenses"

interface EventLicensesTabProps {
  event: Event
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function EventLicensesTab({ event }: EventLicensesTabProps) {
  const { licenses: hooksLicenses } = useLicenses()
  const [licenses, setLicenses] = useState<License[]>([])
  const [localLicenses, setLocalLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false)
  const [isEditLicenseOpen, setIsEditLicenseOpen] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null)
  // Removed addLicenseForm and editLicenseForm state as they are managed in dialogs

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

  // Apply licenses from the useLicenses hook
  useEffect(() => {
    if (hooksLicenses && hooksLicenses.length > 0) {
      const newLicenseItems = hooksLicenses.map(license => ({
        ...license,
        icon: getIconForLicenseType(license.type)
      }))
      
      setLocalLicenses(newLicenseItems)
    }
  }, [hooksLicenses])

  // Merge fetched licenses with local licenses from the hook
  const mergedLicenses = useMemo(() => {
    if (!licenses.length) return localLicenses
    return [...licenses, ...localLicenses]
  }, [licenses, localLicenses])

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
  const filteredLicenses = mergedLicenses.filter((license) => {
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
  const totalCost = mergedLicenses.reduce((sum, license) => sum + license.cost, 0)
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
      
      const rows = mergedLicenses.map(license => [
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

  // Removed handleAddLicenseChange - managed in AddLicenseDialog
  const handleAddLicenseSubmit = async (formData: {
    name: string
    type: string
    description: string
  }) => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const enrichedData = {
        ...formData,
        status: "missing" as const,
        dueDate: new Date().toISOString().split('T')[0],
        issuingAuthority: "",
        cost: "0",
        notes: "",
        eventId: event.id,
        requiredFields: [],
        documents: [],
      }

      const response = await fetch(`${apiUrl}/api/events/${event.id}/licenses`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrichedData),
      })

      if (!response.ok) {
        throw new Error("Failed to create license")
      }

      toast({
        title: "Success",
        description: "License added successfully",
      })

      // Reset form logic is now handled within AddLicenseDialog

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
    // Update the licenses array with the edited license
    setLicenses(prevLicenses => 
      prevLicenses.map(l => l.id === license.id ? { ...license, icon: getIconForLicenseType(license.type) } : l)
    )
  }

  // Handle edit license form change
  // Removed handleEditLicenseChange - managed in EditLicenseDialog
  // Handle saving the edited license
  const handleEditLicenseSubmit = async (formData: {
    name: string
    type: string
    description: string
    status: "approved" | "pending" | "missing" | "rejected"
    dueDate: string
    issuingAuthority: string
    cost: string
    notes: string
    documents: { name: string; uploaded: boolean; url?: string }[]
  }) => {
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
          name: formData.name,
          type: formData.type,
          description: formData.description,
          status: formData.status,
          dueDate: formData.dueDate,
          issuingAuthority: formData.issuingAuthority,
          cost: parseFloat(formData.cost),
          notes: formData.notes,
          requiredFields: selectedLicense.requiredFields,
          documents: formData.documents,
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

  // Removed document handlers - managed in EditLicenseDialog
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

  // Removed getStatusBadge and LicenseCard component definition - moved to LicenseCard.tsx

  return (
    <div className="space-y-6">
      <LicensesHeader
        onExport={handleExport}
        onAddLicense={() => setIsAddLicenseOpen(true)}
      />

      <AddLicenseDialog
        open={isAddLicenseOpen}
        onOpenChange={setIsAddLicenseOpen}
        onSubmit={handleAddLicenseSubmit}
      />

      <EditLicenseDialog
        open={isEditLicenseOpen}
        onOpenChange={setIsEditLicenseOpen}
        license={selectedLicense}
        onSubmit={handleEditLicenseSubmit}
      />

      <LicenseStatsCards
        totalLicenses={mergedLicenses.length}
        approvedLicenses={approvedLicenses.length}
        pendingLicenses={pendingLicenses.length}
        missingLicenses={missingLicenses.length}
        totalCost={totalCost}
        paidCost={paidCost}
      />

      <LicenseManagementTools
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        licenses={mergedLicenses}
        filteredLicenses={filteredLicenses}
        approvedLicenses={approvedLicenses}
        pendingLicenses={pendingLicenses}
        missingLicenses={missingLicenses}
        rejectedLicenses={rejectedLicenses}
        renderLicenseCard={(license) => (
          <LicenseCard
            key={license.id}
            license={license}
            isExpanded={expandedLicense === license.id}
            onToggleExpand={(id) => setExpandedLicense(expandedLicense === id ? null : id)}
            onEditClick={handleEditDialogOpen}
            eventId={event.id}
            onSubmit={async (formData) => {
              setSelectedLicense(license)
              await handleEditLicenseSubmit(formData)
              setSelectedLicense(null)
            }}
          />
        )}
      />
    </div>
  )
}

