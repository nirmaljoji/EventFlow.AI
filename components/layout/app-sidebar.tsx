"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, Users, Settings, BarChart, MessageSquare, PlusCircle, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex flex-col gap-2 p-4">
        <Button className="w-full justify-start gap-2 bg-evenflow-gradient hover:bg-evenflow-gradient-hover border-0">
          <PlusCircle className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <nav className="grid gap-1 px-2 pt-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
              pathname === link.href ? "bg-muted text-evenflow-blue" : "text-muted-foreground",
            )}
          >
            <link.icon className={cn("h-5 w-5", pathname === link.href ? "text-evenflow-blue" : "")} />
            {link.title}
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-lg bg-gradient-to-br from-evenflow-blue/20 via-evenflow-purple/10 to-evenflow-lightblue/5 p-4 border border-evenflow-blue/20">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-evenflow-gradient p-1.5">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-medium">AI Event Assistant</h4>
          </div>
          <p className="text-sm text-muted-foreground">Get instant help with planning, guest management, and more.</p>
          <Button
            variant="default"
            className="mt-3 w-full gap-2 bg-evenflow-gradient hover:bg-evenflow-gradient-hover border-0"
            size="sm"
          >
            <Bot className="h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>
      </div>
    </aside>
  )
}

