// src/app/dashboard/components/EventForm.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Define the form schema using Zod
const formSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  dateTime: z.date({
    required_error: "Please select a date and time.",
  }),
  attendees: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Attendees must be a positive number.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters."
  }),
});

interface EventFormProps {
  onEventCreated?: () => void;
}

export default function EventForm({ onEventCreated }: EventFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [eventData, setEventData] = useState<any>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      location: "",
      attendees: "1",
      description: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          attendees: parseInt(values.attendees),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEventData(data.event);
        setFormComplete(true);
        
        // Call onEventCreated callback if provided
        if (onEventCreated) {
          onEventCreated();
        }
        
        toast.success("Success!", {
            description: "Event created successfully"
          })
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create event");
      }
    } catch (error) {
        toast.error("Error", {
            description: "Failed to create Event."
          })
    } finally {
      setSubmitting(false);
    }
  }

  // Reset the form
  const handleReset = () => {
    form.reset();
    setFormComplete(false);
    setEventData(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {formComplete ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Event Created Successfully!</h3>
            <div className="space-y-2">
              <p><strong>Event Name:</strong> {eventData.eventName}</p>
              <p><strong>Location:</strong> {eventData.location}</p>
              <p><strong>Date & Time:</strong> {new Date(eventData.dateTime).toLocaleString()}</p>
              <p><strong>Expected Attendees:</strong> {eventData.attendees}</p>
              <p><strong>Description:</strong> {eventData.description}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleReset}>Create Another Event</Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Annual Company Retreat" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a descriptive name for your event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Conference Center, New York" {...field} />
                  </FormControl>
                  <FormDescription>
                    Where will the event take place?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP p")
                          ) : (
                            <span>Pick a date & time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input
                          type="time"
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":");
                            const date = new Date(field.value || new Date());
                            date.setHours(parseInt(hours, 10));
                            date.setMinutes(parseInt(minutes, 10));
                            field.onChange(date);
                          }}
                          defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When will your event start?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="attendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Attendees</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Estimated number of attendees.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide details about your event..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what your event is about. (10-500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="animate-spin mr-2">&#9696;</span>
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}