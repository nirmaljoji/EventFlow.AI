"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, MapPinIcon, UsersIcon, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { eventsApi, EventCreateData } from "@/lib/api-client"
import { Switch } from "@/components/ui/switch"

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventCreated?: () => void
}

export function CreateEventDialog({ open, onOpenChange, onEventCreated }: CreateEventDialogProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [loading, setLoading] = useState(false)
  const [isSustainable, setIsSustainable] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    attendees: "",
    description: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const eventData: EventCreateData = {
        eventName: formData.title,
        location: formData.location,
        dateTime: startDate.toISOString(),
        attendees: parseInt(formData.attendees) || 0,
        description: formData.description,
        sustainable: isSustainable
      }
      
      // Add endDate if it's set
      if (endDate) {
        eventData.endDate = endDate.toISOString()
      }
      
      const response = await eventsApi.createEvent(eventData)
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Event created successfully"
        })
        
        // Reset form
        setFormData({
          title: "",
          location: "",
          attendees: "",
          description: ""
        })
        setStartDate(undefined)
        setEndDate(undefined)
        setIsSustainable(false)
        
        // Close dialog
        onOpenChange(false)
        
        // Notify parent component
        if (onEventCreated) {
          onEventCreated()
        }
      }
    } catch (error) {
      console.error("Failed to create event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new event. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title" 
                value={formData.title}
                onChange={handleChange}
                placeholder="Annual Conference 2025" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10" 
                  placeholder="San Francisco, CA" 
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="attendees">Expected Attendees</Label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="attendees" 
                  value={formData.attendees}
                  onChange={handleChange}
                  className="pl-10" 
                  type="number" 
                  placeholder="100" 
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about your event..." 
                className="min-h-[100px]" 
              />
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                  <Leaf className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <Label htmlFor="sustainable-mode" className="font-medium">
                    Sustainable Event Planning
                  </Label>
                  <p className="text-sm text-muted-foreground">Reduce environmental impact with eco-friendly options</p>
                </div>
              </div>
              <Switch
                id="sustainable-mode"
                checked={isSustainable}
                onCheckedChange={setIsSustainable}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

