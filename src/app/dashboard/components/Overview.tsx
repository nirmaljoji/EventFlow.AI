"use client";

import { Calendar, Clock, MapPin, Users, DollarSign, FileCheck, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Overview() {
  // Sample event details (normally would come from an API or props)
  const eventDetails = {
    name: "Annual Corporate Gala",
    date: "April 15, 2025",
    time: "6:00 PM - 11:00 PM",
    location: "Grand Horizon Ballroom",
    budget: "$25,000",
    guestsCount: 150,
    status: "Planning"
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {eventDetails.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{eventDetails.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{eventDetails.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{eventDetails.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{eventDetails.guestsCount} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={14} />
                  <span>{eventDetails.budget}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Badge 
                variant="outline" 
                className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700"
              >
                {eventDetails.status}
              </Badge>
              <Select defaultValue="actions">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actions">Actions</SelectItem>
                  <SelectItem value="duplicate">Duplicate Event</SelectItem>
                  <SelectItem value="export">Export Details</SelectItem>
                  <SelectItem value="archive">Archive Event</SelectItem>
                </SelectContent>
              </Select>
              <Button className="ml-2">Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Guest RSVP Status
                </h3>
                <div className="text-2xl font-bold mt-1">
                  82 / {eventDetails.guestsCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <Utensils className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Catering Confirmed
                </h3>
                <div className="text-2xl font-bold mt-1">Yes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <FileCheck className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Pending Permits
                </h3>
                <div className="text-2xl font-bold mt-1">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}