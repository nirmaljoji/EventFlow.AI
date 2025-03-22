"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Check, 
  ChevronDown, 
  Clock, 
  Download, 
  Edit, 
  Filter, 
  Mail, 
  MoreHorizontal, 
  Phone, 
  Plus, 
  Search, 
  Share2, 
  Trash, 
  Users, 
  XCircle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  
  // Mock data for guests
  const guestData = [
    { id: 1, name: "Emma Thompson", email: "emma@example.com", phone: "+1 (555) 123-4567", status: "confirmed", rsvpDate: "2025-03-10", dietaryRestrictions: "Vegetarian", plusOnes: 1, tableAssignment: "Table 3" },
    { id: 2, name: "James Wilson", email: "james@example.com", phone: "+1 (555) 234-5678", status: "pending", rsvpDate: null, dietaryRestrictions: "None", plusOnes: 0, tableAssignment: "Unassigned" },
    { id: 3, name: "Sophia Martinez", email: "sophia@example.com", phone: "+1 (555) 345-6789", status: "confirmed", rsvpDate: "2025-03-15", dietaryRestrictions: "Gluten-free", plusOnes: 2, tableAssignment: "Table 1" },
    { id: 4, name: "Michael Johnson", email: "michael@example.com", phone: "+1 (555) 456-7890", status: "declined", rsvpDate: "2025-03-05", dietaryRestrictions: "None", plusOnes: 0, tableAssignment: "N/A" },
    { id: 5, name: "Olivia Brown", email: "olivia@example.com", phone: "+1 (555) 567-8901", status: "confirmed", rsvpDate: "2025-03-12", dietaryRestrictions: "Dairy-free", plusOnes: 1, tableAssignment: "Table 2" },
    { id: 6, name: "William Davis", email: "william@example.com", phone: "+1 (555) 678-9012", status: "pending", rsvpDate: null, dietaryRestrictions: "None", plusOnes: 0, tableAssignment: "Unassigned" },
    { id: 7, name: "Ava Miller", email: "ava@example.com", phone: "+1 (555) 789-0123", status: "confirmed", rsvpDate: "2025-03-18", dietaryRestrictions: "Nut allergy", plusOnes: 0, tableAssignment: "Table 5" },
    { id: 8, name: "Alexander Taylor", email: "alex@example.com", phone: "+1 (555) 890-1234", status: "declined", rsvpDate: "2025-03-07", dietaryRestrictions: "None", plusOnes: 0, tableAssignment: "N/A" },
  ];
  
  // Filter function for search and status
  const filterGuests = (status) => {
    return guestData
      .filter(guest => 
        (status === "all" || guest.status === status) && 
        (guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         guest.phone.includes(searchTerm))
      );
  };
  
  // Calculate statistics
  const stats = {
    total: guestData.length,
    confirmed: guestData.filter(g => g.status === "confirmed").length,
    pending: guestData.filter(g => g.status === "pending").length,
    declined: guestData.filter(g => g.status === "declined").length,
    responseRate: Math.round(((guestData.filter(g => g.status === "confirmed" || g.status === "declined").length) / guestData.length) * 100)
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      confirmed: "bg-green-100 text-green-800 hover:bg-green-200",
      pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      declined: "bg-red-100 text-red-800 hover:bg-red-200"
    };
    
    const statusIcons = {
      confirmed: <Check className="w-3 h-3 mr-1" />,
      pending: <Clock className="w-3 h-3 mr-1" />,
      declined: <XCircle className="w-3 h-3 mr-1" />
    };
    
    return (
      <Badge variant="outline" className={`flex items-center ${statusStyles[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  // Guest card component for grid view
  const GuestCard = ({ guest }) => (
    <Card className="max-w-xs p-2">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {guest.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm leading-tight">{guest.name}</CardTitle>
              <CardDescription className="text-xs leading-tight mt-0.5">
                <StatusBadge status={guest.status} />
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-1">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1">
              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                <Mail className="mr-1 h-3 w-3" /> Send Reminder
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                <Calendar className="mr-1 h-3 w-3" /> Assign Table
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                <Edit className="mr-1 h-3 w-3" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-red-600">
                <Trash className="mr-1 h-3 w-3" /> Remove Guest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <Mail className="h-3 w-3 mr-1 opacity-70" />
            <span className="text-muted-foreground">{guest.email}</span>
          </div>
          <div className="flex items-center text-xs">
            <Phone className="h-3 w-3 mr-1 opacity-70" />
            <span className="text-muted-foreground">{guest.phone}</span>
          </div>
          {guest.rsvpDate && (
            <div className="flex items-center text-xs">
              <Calendar className="h-3 w-3 mr-1 opacity-70" />
              <span className="text-muted-foreground">
                RSVP on {new Date(guest.rsvpDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {guest.plusOnes > 0 && (
            <div className="flex items-center text-xs">
              <Users className="h-3 w-3 mr-1 opacity-70" />
              <span className="text-muted-foreground">
                +{guest.plusOnes} {guest.plusOnes === 1 ? "guest" : "guests"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guest Management</h2>
          <p className="text-muted-foreground mt-1">Organize and track your event attendees</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add New Guest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
                <DialogDescription>Fill in the guest details below.</DialogDescription>
              </DialogHeader>
              {/* Form would go here */}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Full Name</label>
                  <Input id="name" placeholder="Enter guest name" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email">Email Address</label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="phone">Phone Number</label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Add Guest</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Print Guest List</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Guests</div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="mt-2 flex items-center text-sm">
              <Users className="h-4 w-4 mr-1 text-primary" />
              <span>Including {guestData.reduce((sum, g) => sum + g.plusOnes, 0)} plus-ones</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground mb-1">Confirmed</div>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="mt-2 flex items-center text-sm">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              <span>{Math.round((stats.confirmed / stats.total) * 100)}% of invitations</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="mt-2 flex items-center text-sm">
              <Bell className="h-4 w-4 mr-1 text-amber-600" />
              <span>Send {stats.pending} reminders</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground mb-1">Response Rate</div>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <Progress value={stats.responseRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search guests by name, email or phone..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Guests</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>With Dietary Restrictions</DropdownMenuItem>
              <DropdownMenuItem>With Plus Ones</DropdownMenuItem>
              <DropdownMenuItem>Unassigned Tables</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
          >
            {viewMode === "table" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </Button>
        </div>
      </div>
      
      {/* Tabs and content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Guests
            <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Confirmed
            <Badge variant="secondary" className="ml-1">{stats.confirmed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
            <Badge variant="secondary" className="ml-1">{stats.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="declined" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Declined
            <Badge variant="secondary" className="ml-1">{stats.declined}</Badge>
          </TabsTrigger>
        </TabsList>
        
        {["all", "confirmed", "pending", "declined"].map((tab) => (
          <TabsContent key={tab} value={tab} className="border rounded-lg p-0 shadow-sm">
            {viewMode === "table" ? (
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGuests(filterGuests(tab).map(g => g.id));
                            } else {
                              setSelectedGuests([]);
                            }
                          }}
                          checked={selectedGuests.length === filterGuests(tab).length && filterGuests(tab).length > 0}
                        />
                      </TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Contact Information</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>RSVP Date</TableHead>
                      <TableHead>Plus Ones</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterGuests(tab).length > 0 ? (
                      filterGuests(tab).map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300"
                              checked={selectedGuests.includes(guest.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGuests([...selectedGuests, guest.id]);
                                } else {
                                  setSelectedGuests(selectedGuests.filter(id => id !== guest.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{guest.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{guest.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 opacity-70" /> 
                                <span>{guest.email}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3 opacity-70" /> 
                                <span>{guest.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={guest.status} />
                          </TableCell>
                          <TableCell>
                            {guest.rsvpDate ? new Date(guest.rsvpDate).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell>
                            {guest.plusOnes > 0 ? `+${guest.plusOnes}` : '—'}
                          </TableCell>
                          <TableCell>
                            {guest.tableAssignment !== "Unassigned" && guest.tableAssignment !== "N/A" ? (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {guest.tableAssignment}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">{guest.tableAssignment}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" /> Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" /> Assign Table
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" /> Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" /> Remove Guest
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                              <path d="M17.5 21.2a9 9 0 1 1-11-13.9" />
                              <path d="M9 4.5H4a2 2 0 0 0-2 2v4" />
                              <path d="M14 21V16a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v5" />
                              <path d="M21 16a2 2 0 0 1-2 2h-2.5" />
                            </svg>
                            <p>No guests found</p>
                            <Button variant="ghost" size="sm" className="mt-2">
                              <Plus className="h-4 w-4 mr-1" /> Add a Guest
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-4">
                {filterGuests(tab).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filterGuests(tab).map((guest) => (
                      <GuestCard key={guest.id} guest={guest} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p className="text-lg">No guests found</p>
                    <p className="text-sm mt-1">Try adjusting your search or add new guests</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="h-4 w-4 mr-1" /> Add a Guest
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {filterGuests(tab).length > 0 && (
              <div className="border-t p-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedGuests.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <span>{selectedGuests.length} selected</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Button variant="ghost" size="sm">
                        <Mail className="h-3 w-3 mr-1" /> Send Message
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-3 w-3 mr-1" /> Assign Table
                      </Button>
                    </div>
                  ) : (
                    `Showing ${filterGuests(tab).length} of ${stats.total} guests`
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}