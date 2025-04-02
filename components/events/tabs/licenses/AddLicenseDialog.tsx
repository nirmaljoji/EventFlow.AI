"use client"

import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"

interface AddLicenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: {
    name: string
    type: string
    description: string
    status: "missing"
    dueDate: string
    issuingAuthority: string
    cost: string
    notes: string
  }) => Promise<void>
}

export function AddLicenseDialog({ open, onOpenChange, onSubmit }: AddLicenseDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    status: "missing" as const,
    dueDate: "",
    issuingAuthority: "",
    cost: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      setFormData({
        name: "",
        type: "",
        description: "",
        status: "missing",
        dueDate: "",
        issuingAuthority: "",
        cost: "",
        notes: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding license:", error)
      toast({
        title: "Error",
        description: "Failed to add license. Please try again.",
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
          <DialogTitle>Add New License</DialogTitle>
          <DialogDescription>
            Add a new license or permit required for your event.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-1 my-1 flex-grow">
          <form id="add-license-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">License Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Special Event Permit"
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
                placeholder="Describe the license requirements..."
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
                value={formData.dueDate}
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
                placeholder="0.00"
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
                placeholder="Additional notes..."
              />
            </div>
          </form>
        </div>
        <DialogFooter className="flex-shrink-0 pt-2 mt-2 border-t">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="add-license-form" disabled={loading}>
            {loading ? "Adding..." : "Add License"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}