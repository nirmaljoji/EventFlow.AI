"use client";

import React from 'react';
import { 
  CalendarDays, 
  Users, 
  MapPin, 
  MessageSquare, 
  Wallet, 
  PieChart 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FeaturesSection() {
  // Agent data with specialized roles
  const agents = [
    {
      id: "scheduling",
      name: "Scheduling Agent",
      icon: <CalendarDays className="h-10 w-10 text-blue-600" />,
      description: "Intelligently optimizes event timelines and manages scheduling conflicts",
      capabilities: ["Availability analysis", "Timeline optimization", "Calendar integration"],
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "attendee",
      name: "Attendee Management Agent",
      icon: <Users className="h-10 w-10 text-purple-600" />,
      description: "Handles guest lists, RSVPs, and personalized attendee communications",
      capabilities: ["RSVP tracking", "Guest preferences", "Communication automation"],
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: "venue",
      name: "Venue Selection Agent",
      icon: <MapPin className="h-10 w-10 text-green-600" />,
      description: "Identifies and evaluates optimal venues based on event requirements",
      capabilities: ["Location analysis", "Space optimization", "Vendor coordination"],
      color: "bg-green-50 border-green-200"
    },
    {
      id: "communication",
      name: "Communication Agent",
      icon: <MessageSquare className="h-10 w-10 text-yellow-600" />,
      description: "Manages all stakeholder communications and status updates",
      capabilities: ["Automated notifications", "Feedback collection", "Stakeholder updates"],
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      id: "budget",
      name: "Budget Management Agent",
      icon: <Wallet className="h-10 w-10 text-red-600" />,
      description: "Optimizes budget allocation and tracks expenses in real-time",
      capabilities: ["Cost optimization", "Expense tracking", "Budget forecasting"],
      color: "bg-red-50 border-red-200"
    },
    {
      id: "analytics",
      name: "Analytics Agent",
      icon: <PieChart className="h-10 w-10 text-indigo-600" />,
      description: "Provides actionable insights and performance metrics for every event",
      capabilities: ["Performance metrics", "Success forecasting", "Post-event analysis"],
      color: "bg-indigo-50 border-indigo-200"
    }
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm font-medium border-blue-200 text-blue-700">
            Revolutionary Approach
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            AI-Powered Event Orchestration
          </h2>
          <p className="text-slate-600 text-lg">
            Six specialized AI agents working in concert to transform how you plan and execute flawless events
          </p>
        </div>

        {/* Hexagonal agent layout */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {agents.map((agent) => (
              <Card 
                key={agent.id} 
                className={`border-2 ${agent.color} hover:shadow-lg transition-shadow duration-300`}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2 rounded-lg bg-white shadow-sm border">
                    {agent.icon}
                  </div>
                  <CardTitle>{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{agent.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability, idx) => (
                      <Badge key={idx} variant="secondary" className="font-normal">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}