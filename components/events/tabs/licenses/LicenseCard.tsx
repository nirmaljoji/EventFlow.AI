"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Edit,
  Plus,
  Save,
} from "lucide-react"
import type { License } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface LicenseCardProps {
  license: License
  isExpanded: boolean
  onToggleExpand: (id: string) => void
  onEditClick: (license: License) => void
  eventId: string
  onSubmit: (formData: {
    name: string
    type: string
    description: string
    status: "approved" | "pending" | "missing" | "rejected"
    dueDate: string
    issuingAuthority: string
    cost: string
    notes: string
    documents: { name: string; uploaded: boolean; url?: string }[]
  }) => Promise<void>
}

// Helper function to get status badge
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

export function LicenseCard({ 
  license, 
  isExpanded, 
  onToggleExpand, 
  onEditClick,
  eventId,
  onSubmit 
}: LicenseCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLicense, setEditedLicense] = useState(license)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Prepare API payload - ensure all fields required by LicenseCreate model are included
      const formData = {
        name: editedLicense.name,
        type: editedLicense.type,
        description: editedLicense.description,
        status: editedLicense.status,
        dueDate: editedLicense.dueDate,
        issuingAuthority: editedLicense.issuingAuthority,
        cost: parseFloat(editedLicense.cost.toString()), // Send as number, not string
        notes: editedLicense.notes || "",
        documents: editedLicense.documents || [],
        eventId: eventId,
        // Required fields in LicenseCreate but may not be present in the frontend model
        requiredFields: editedLicense.requiredFields || [],
        applicationDate: editedLicense.applicationDate,
        approvalDate: editedLicense.approvalDate,
        rejectionReason: editedLicense.rejectionReason
      }

      console.log('Making API call to:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/events/${eventId}/licenses/${license.id}`)
      console.log('Payload:', JSON.stringify(formData))

      // Make direct API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/events/${eventId}/licenses/${license.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API error response:', response.status, errorData)
        throw new Error(`Failed to update license: ${response.status} ${errorData}`)
      }

      // Call onSubmit to update parent state with string cost for form compatibility
      const parentFormData = {
        ...formData,
        cost: formData.cost.toString()
      }
      await onSubmit(parentFormData)
      setIsEditing(false)
      onEditClick({ ...editedLicense, icon: license.icon }) // Update parent state with icon

      toast({
        title: "Success",
        description: "License updated successfully",
      })
    } catch (error) {
      console.error("Error updating license:", error)
      toast({
        title: "Error",
        description: "Failed to update license. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to update document status
  const handleDocumentStatusChange = async (index: number, checked: boolean) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Create a new documents array with the updated status
      const newDocs = [...(editedLicense.documents || [])]
      if (!newDocs[index]) {
        console.error("Document at index", index, "does not exist");
        return;
      }
      
      newDocs[index] = { ...newDocs[index], uploaded: checked }
      
      // Update local state optimistically
      setEditedLicense({ ...editedLicense, documents: newDocs })

      // Prepare API payload - ensure all fields required by LicenseCreate model are included
      const formData = {
        name: editedLicense.name,
        type: editedLicense.type,
        description: editedLicense.description,
        status: editedLicense.status,
        dueDate: editedLicense.dueDate,
        issuingAuthority: editedLicense.issuingAuthority,
        cost: parseFloat(editedLicense.cost.toString()), // Send as number, not string
        notes: editedLicense.notes || "",
        documents: newDocs,
        eventId: eventId,
        // Required fields in LicenseCreate but may not be present in the frontend model
        requiredFields: editedLicense.requiredFields || [],
        applicationDate: editedLicense.applicationDate,
        approvalDate: editedLicense.approvalDate,
        rejectionReason: editedLicense.rejectionReason
      }

      console.log('Making API call to:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/events/${eventId}/licenses/${license.id}`)
      console.log('Payload:', JSON.stringify(formData))

      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/events/${eventId}/licenses/${license.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API error response:', response.status, errorData)
        throw new Error(`Failed to update document status: ${response.status} ${errorData}`)
      }

      // Update parent state
      onEditClick({ ...editedLicense, documents: newDocs, icon: license.icon })
      
      toast({
        title: "Success",
        description: "Document status updated",
      })
    } catch (error) {
      console.error("Error updating document status:", error)
      
      // Revert the change in case of error
      const revertedDocs = [...editedLicense.documents]
      revertedDocs[index] = { ...revertedDocs[index], uploaded: !checked }
      setEditedLicense({ ...editedLicense, documents: revertedDocs })
      
      toast({
        title: "Error",
        description: "Failed to update document status. Please try again.",
        variant: "destructive",
      })
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
            <CardTitle className="text-base">{license.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(license.status)}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleExpand(license.id)}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Name</span>
                  {isEditing ? (
                    <Input
                      value={editedLicense.name}
                      onChange={(e) => setEditedLicense({ ...editedLicense, name: e.target.value })}
                      className="h-9"
                    />
                  ) : (
                    <p className="text-sm font-medium">{license.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Type</span>
                  {isEditing ? (
                    <Select
                      value={editedLicense.type}
                      onValueChange={(value) => setEditedLicense({ ...editedLicense, type: value })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Venue">Venue</SelectItem>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium">{license.type}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {isEditing ? (
                    <Select
                      value={editedLicense.status}
                      onValueChange={(value: "approved" | "pending" | "missing" | "rejected") =>
                        setEditedLicense({ ...editedLicense, status: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>{getStatusBadge(license.status)}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Issuing Authority</span>
                  {isEditing ? (
                    <Input
                      value={editedLicense.issuingAuthority}
                      onChange={(e) => setEditedLicense({ ...editedLicense, issuingAuthority: e.target.value })}
                      className="h-9"
                    />
                  ) : (
                    <p className="text-sm font-medium">{license.issuingAuthority}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedLicense.dueDate.split('T')[0]}
                      onChange={(e) => setEditedLicense({ ...editedLicense, dueDate: e.target.value })}
                      className="h-9"
                    />
                  ) : (
                    <p className="text-sm font-medium">{new Date(license.dueDate).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedLicense.cost}
                      onChange={(e) => setEditedLicense({ ...editedLicense, cost: parseFloat(e.target.value) })}
                      className="h-9"
                      step="0.01"
                    />
                  ) : (
                    <p className="text-sm font-medium">${license.cost.toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Description</span>
                {isEditing ? (
                  <Textarea
                    value={editedLicense.description}
                    onChange={(e) => setEditedLicense({ ...editedLicense, description: e.target.value })}
                    className="resize-none min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{license.description}</p>
                )}
              </div>

              {/* Required Documents Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Required Documents</h4>
                  <span className="text-sm text-muted-foreground">
                    {editedLicense.documents && editedLicense.documents.filter(doc => doc.uploaded).length} / {editedLicense.documents ? editedLicense.documents.length : 0}
                  </span>
                </div>
                <div className="rounded-md border p-3">
                  <div className="space-y-3">
                    {editedLicense.documents && editedLicense.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Checkbox
                          checked={doc.uploaded}
                          onCheckedChange={(checked) => {
                            if (isEditing) {
                              const newDocs = [...editedLicense.documents]
                              newDocs[index] = { ...doc, uploaded: checked as boolean }
                              setEditedLicense({ ...editedLicense, documents: newDocs })
                            } else {
                              handleDocumentStatusChange(index, checked as boolean)
                            }
                          }}
                        />
                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={doc.name}
                              onChange={(e) => {
                                const newDocs = [...editedLicense.documents]
                                newDocs[index] = { ...doc, name: e.target.value }
                                setEditedLicense({ ...editedLicense, documents: newDocs })
                              }}
                              className="h-8"
                              placeholder="Document name"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                const newDocs = [...editedLicense.documents]
                                newDocs.splice(index, 1)
                                setEditedLicense({ ...editedLicense, documents: newDocs })
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between flex-1">
                            <span className="text-sm">{doc.name}</span>
                            {doc.url && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0"
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                View
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          setEditedLicense({
                            ...editedLicense,
                            documents: [
                              ...(editedLicense.documents || []),
                              { name: "", uploaded: false }
                            ]
                          })
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Document
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {license.notes && !isEditing && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">Notes:</p>
                  <p>{license.notes}</p>
                </div>
              )}

              {license.rejectionReason && !isEditing && (
                <div className="rounded-md bg-red-50 p-3 text-sm border border-red-200 text-red-700">
                  <p className="font-medium">Rejection Reason:</p>
                  <p>{license.rejectionReason}</p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-2 border-t">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                {license.status === "approved" && (
                  <Button size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
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