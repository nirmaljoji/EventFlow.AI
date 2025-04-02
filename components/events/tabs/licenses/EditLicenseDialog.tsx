"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { License } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface EditLicenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  license: License | null
  onSubmit: (formData: {
    name: string
    type: string
    description: string
    status: "approved" | "pending" | "missing" | "rejected"
    dueDate: string
    issuingAuthority: string
    cost: string
    notes: string
    documents: {
      name: string
      uploaded: boolean
      url?: string
    }[]
  }) => Promise<void>
}

export function EditLicenseDialog({ open, onOpenChange, license, onSubmit }: EditLicenseDialogProps) {
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false)

  // Update form when license changes
  useEffect(() => {
    if (license) {
      setFormData({
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
    }
  }, [license])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { name: "", uploaded: false }]
    }))
  }

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleDocumentChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!license) return
    setLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit License</DialogTitle>
          <DialogDescription>
            Edit the details of the license.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-1 my-1 flex-grow">
          <form id="edit-license-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">License Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Venue">Venue</SelectItem>
                  <SelectItem value="Food &amp; Beverage">Food &amp; Beverage</SelectItem>
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
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "approved" | "pending" | "missing" | "rejected" }))}
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
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="issuingAuthority">Issuing Authority</Label>
              <Input
                id="issuingAuthority"
                name="issuingAuthority"
                value={formData.issuingAuthority}
                onChange={handleChange}
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
                value={formData.cost}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
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
                {formData.documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No documents added yet</p>
                ) : (
                  formData.documents.map((doc, index) => (
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
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="edit-license-form" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}