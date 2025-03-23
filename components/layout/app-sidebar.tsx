"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, Users, Settings, BarChart, MessageSquare, PlusCircle, Bot, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Attendees",
    href: "/attendees",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay that appears when sidebar is open on small screens */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={onToggle}
      />
      
      {/* Desktop sidebar toggle button - always visible */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "fixed top-1/2 transform -translate-y-1/2 z-[100] cursor-pointer",
          "lg:flex hidden items-center justify-center",
          "w-7 h-14 bg-blue-600/20 hover:bg-blue-600/30",
          "rounded-e-lg transition-all duration-300",
          collapsed ? "left-16" : "left-64"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-blue-600" />
        )}
      </button>
      
      <aside 
        className={cn(
          "fixed lg:sticky top-16 h-[calc(100vh-4rem)] flex-col border-r z-50 lg:z-auto transition-all duration-300 ease-in-out",
          "flex bg-background lg:bg-muted/40", // Solid background on mobile, semi-transparent on desktop
          "max-lg:shadow-lg", // Add shadow on mobile only
          collapsed ? "w-16" : "w-64",
          // On mobile: hide when collapsed, show when expanded
          collapsed ? "max-lg:-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col gap-2 p-4">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-full aspect-square p-0 justify-center bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>New Event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button className="w-full justify-start gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0">
              <PlusCircle className="h-4 w-4" />
              New Event
            </Button>
          )}
        </div>

        <nav className="grid gap-1 px-2 pt-2">
          {sidebarLinks.map((link) => (
            <TooltipProvider key={link.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center rounded-lg py-2 text-sm font-medium transition-all hover:bg-muted",
                      pathname === link.href 
                        ? "bg-muted text-blue-600 max-lg:bg-blue-600/10" 
                        : "text-muted-foreground max-lg:text-foreground/80",
                      collapsed ? "justify-center px-2" : "px-3 gap-3"
                    )}
                  >
                    <link.icon className={cn("h-5 w-5", pathname === link.href ? "text-blue-600" : "")} />
                    {!collapsed && link.title}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{link.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        {!collapsed && (
          <div className="mt-auto p-4">
            <div className="rounded-lg p-4 border max-lg:bg-blue-600/5 max-lg:border-blue-600/20 lg:bg-gradient-to-br lg:from-blue-600/20 lg:via-indigo-600/10 lg:to-blue-300/5 lg:border-blue-600/20">
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium">AI Event Assistant</h4>
              </div>
              <p className="text-sm text-muted-foreground max-lg:text-foreground/70">Get instant help with planning, guest management, and more.</p>
              <Button
                variant="default"
                className="mt-3 w-full gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
                size="sm"
              >
                <Bot className="h-4 w-4" />
                Ask AI Assistant
              </Button>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="mt-auto p-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-full aspect-square p-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0">
                    <Bot className="h-4 w-4 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Ask AI Assistant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* Mobile close button - only visible on small screens when sidebar is open */}
        <div 
          onClick={onToggle}
          className={cn(
            "absolute top-4 right-4 lg:hidden",
            "rounded-full p-1.5 bg-blue-600/20 hover:bg-blue-600/30 transition-colors"
          )}
        >
          <ChevronLeft className="h-5 w-5 text-blue-600" />
        </div>
      </aside>
    </>
  )
}

