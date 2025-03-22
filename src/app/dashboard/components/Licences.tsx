"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, FileText, CheckCircle, Clock, AlertCircle, Plus, Search, Download, Calendar, MapPin, Mail, User, Phone, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Type definitions
interface License {
  id: string;
  title: string;
  description: string;
  status: "approved" | "pending" | "rejected" | "not-started";
  progress: number;
  dueDate: string;
  requiredFields: string[];
  cost: string;
  processingTime: string;
  approvalDate?: string;
  permitNumber?: string;
  rejectionReason?: string;
}

interface LicenseCardProps {
  license: License;
  expanded: boolean;
  toggleExpand: () => void;
}

// Sample data for demo purposes
const licenseTypes: License[] = [
  {
    id: "l1",
    title: "Alcohol Service Permit",
    description: "Required for events serving alcoholic beverages to attendees.",
    status: "pending",
    progress: 60,
    dueDate: "April 15, 2025",
    requiredFields: ["Business Name", "Contact Person", "Email", "Phone", "Event Address", "Service Hours"],
    cost: "$350",
    processingTime: "10-14 days"
  },
  {
    id: "l2",
    title: "Sound & Amplification License",
    description: "Required for events with music, performances or announcements using amplified sound.",
    status: "not-started",
    progress: 0,
    dueDate: "April 5, 2025",
    requiredFields: ["Event Name", "Location", "Sound Equipment Details", "Start/End Times", "Sound Engineer Contact"],
    cost: "$125",
    processingTime: "5-7 days"
  },
  {
    id: "l3",
    title: "Food Vendor Permit",
    description: "Required for events offering food prepared on-site or by external vendors.",
    status: "approved",
    progress: 100,
    dueDate: "March 10, 2025",
    requiredFields: ["Vendor Information", "Menu Items", "Food Handler Certificates", "Equipment Details"],
    cost: "$200",
    processingTime: "7-10 days",
    approvalDate: "March 8, 2025",
    permitNumber: "FVP-2025-7852"
  },
  {
    id: "l4",
    title: "Special Event Insurance",
    description: "Liability coverage required for public events with more than 50 attendees.",
    status: "rejected",
    progress: 80,
    dueDate: "April 2, 2025",
    requiredFields: ["Event Details", "Expected Attendance", "Venue Information", "Activities Description"],
    cost: "$500-$1,500",
    processingTime: "3-5 days",
    rejectionReason: "Incomplete venue safety information"
  }
];

// Status badge mapping
const getStatusBadge = (status: "approved" | "pending" | "rejected" | "not-started") => {
  switch(status) {
    case "approved":
      return <Badge className="bg-green-600 text-white flex items-center gap-1"><CheckCircle size={14} /> Approved</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 text-white flex items-center gap-1"><Clock size={14} /> Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-500 text-white flex items-center gap-1"><AlertCircle size={14} /> Rejected</Badge>;
    case "not-started":
    default:
      return <Badge className="bg-gray-500 text-white flex items-center gap-1"><FileText size={14} /> Not Started</Badge>;
  }
};

// Progress color mapping
const getProgressColor = (status: "approved" | "pending" | "rejected" | "not-started") => {
  switch(status) {
    case "approved": return "bg-green-600";
    case "pending": return "bg-yellow-500";
    case "rejected": return "bg-red-500";
    case "not-started":
    default: return "bg-gray-500";
  }
};

export default function Licenses() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Filter licenses based on search and tab
  const filterLicenses = (licenses: License[], status: "approved" | "pending" | "rejected" | "not-started" | null = null) => {
    return licenses
      .filter(license => 
        license.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (status === null || license.status === status)
      )
      .sort((a, b) => {
        if (sortBy === "dueDate") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
          return a.title.localeCompare(b.title);
        }
      });
  };

  // Counts for tabs
  const counts = {
    required: licenseTypes.filter(l => l.status === "not-started").length,
    pending: licenseTypes.filter(l => l.status === "pending").length,
    approved: licenseTypes.filter(l => l.status === "approved").length,
    rejected: licenseTypes.filter(l => l.status === "rejected").length
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <FileText className="mr-2" size={24} />
            Licenses & Permits
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage all required documentation for your event
          </p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 h-10">
          <Plus size={16} className="mr-2" /> Add New Permit
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search permits..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all" className="text-sm">All Permits</TabsTrigger>
          <TabsTrigger value="not-started" className="text-sm">
            Required ({counts.required})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-sm">
            Pending ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-sm">
            Approved ({counts.approved})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-sm">
            Rejected ({counts.rejected})
          </TabsTrigger>
        </TabsList>

        {/* All Permits Tab */}
        <TabsContent value="all" className="space-y-4">
          {filterLicenses(licenseTypes).length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-slate-500 dark:text-slate-400">No permits found matching your search.</p>
            </div>
          ) : (
            filterLicenses(licenseTypes).map(license => (
              <LicenseCard 
                key={license.id} 
                license={license} 
                expanded={expandedCard === license.id} 
                toggleExpand={() => toggleExpand(license.id)} 
              />
            ))
          )}
        </TabsContent>

        {/* Required Permits Tab */}
        <TabsContent value="not-started" className="space-y-4">
          {filterLicenses(licenseTypes, "not-started").length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-slate-500 dark:text-slate-400">No required permits found.</p>
            </div>
          ) : (
            filterLicenses(licenseTypes, "not-started").map(license => (
              <LicenseCard 
                key={license.id} 
                license={license} 
                expanded={expandedCard === license.id} 
                toggleExpand={() => toggleExpand(license.id)} 
              />
            ))
          )}
        </TabsContent>

        {/* Pending Permits Tab */}
        <TabsContent value="pending" className="space-y-4">
          {filterLicenses(licenseTypes, "pending").length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-slate-500 dark:text-slate-400">No pending permits found.</p>
            </div>
          ) : (
            filterLicenses(licenseTypes, "pending").map(license => (
              <LicenseCard 
                key={license.id} 
                license={license} 
                expanded={expandedCard === license.id} 
                toggleExpand={() => toggleExpand(license.id)} 
              />
            ))
          )}
        </TabsContent>

        {/* Approved Permits Tab */}
        <TabsContent value="approved" className="space-y-4">
          {filterLicenses(licenseTypes, "approved").length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-slate-500 dark:text-slate-400">No approved permits found.</p>
            </div>
          ) : (
            filterLicenses(licenseTypes, "approved").map(license => (
              <LicenseCard 
                key={license.id} 
                license={license} 
                expanded={expandedCard === license.id} 
                toggleExpand={() => toggleExpand(license.id)} 
              />
            ))
          )}
        </TabsContent>

        {/* Rejected Permits Tab */}
        <TabsContent value="rejected" className="space-y-4">
          {filterLicenses(licenseTypes, "rejected").length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-slate-500 dark:text-slate-400">No rejected permits found.</p>
            </div>
          ) : (
            filterLicenses(licenseTypes, "rejected").map(license => (
              <LicenseCard 
                key={license.id} 
                license={license} 
                expanded={expandedCard === license.id} 
                toggleExpand={() => toggleExpand(license.id)} 
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// License Card Component
// License Card Component
const LicenseCard: React.FC<LicenseCardProps> = ({ license, expanded, toggleExpand }) => {
    return (
      // Adding "p-0" here ensures that any default padding from the Card is removed
      <Card
        className="p-0 overflow-hidden transition-all duration-300 border-l-4"
        style={{ borderLeftColor: getStatusBadgeColor(license.status) }}
      >
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={toggleExpand}
        >
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              {license.title}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              {getStatusBadge(license.status)}
              <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar size={14} /> Due: {license.dueDate}
              </div>
            </div>
          </div>
  
          <div className="flex items-center gap-4">
            <div className="w-32 hidden md:block">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{license.progress}%</span>
              </div>
              <Progress value={license.progress} className={`h-2 ${getProgressColor(license.status)}`} />
            </div>
            
            <Button variant="ghost" size="sm">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
          </div>
        </div>
  
        {expanded && (
          // Changing from p-6 to p-4 makes the expanded section more compact
          <CardContent className="bg-slate-50 dark:bg-slate-900 p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Description
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {license.description}
                </p>
                
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Required Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {license.requiredFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                        {getFieldIcon(field)}
                      </div>
                      {field}
                    </div>
                  ))}
                </div>
  
                {license.status === "rejected" && license.rejectionReason && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
                      <AlertCircle size={16} /> Rejection Reason
                    </h4>
                    <p className="text-red-600 dark:text-red-300">
                      {license.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
  
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Permit Details
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Application Fee:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {license.cost}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Processing Time:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {license.processingTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Due Date:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {license.dueDate}
                    </span>
                  </div>
                  
                  {license.status === "approved" && license.approvalDate && license.permitNumber && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                          Approval Date:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {license.approvalDate}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                          Permit Number:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {license.permitNumber}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  {license.status === "approved" ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Download size={16} className="mr-2" /> Download Permit
                    </Button>
                  ) : license.status === "not-started" ? (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Start Application
                    </Button>
                  ) : license.status === "pending" ? (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Continue Application
                    </Button>
                  ) : (
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Update Application
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    View Requirements
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

// Helper functions
const getStatusBadgeColor = (status: "approved" | "pending" | "rejected" | "not-started"): string => {
  switch(status) {
    case "approved": return "#10b981"; // green
    case "pending": return "#f59e0b"; // yellow
    case "rejected": return "#ef4444"; // red
    case "not-started":
    default: return "#6b7280"; // gray
  }
};

const getFieldIcon = (field: string) => {
  if (field.toLowerCase().includes("name")) return <User size={14} />;
  if (field.toLowerCase().includes("email")) return <Mail size={14} />;
  if (field.toLowerCase().includes("address") || field.toLowerCase().includes("location")) return <MapPin size={14} />;
  if (field.toLowerCase().includes("phone")) return <Phone size={14} />;
  return <FileText size={14} />;
};