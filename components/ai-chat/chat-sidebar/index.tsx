"use client"

import { useState, useRef, useEffect } from "react"
import { CopilotChat } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css"
import { useCoAgent, useCoAgentStateRender } from '@copilotkit/react-core';
// Import styles directly in the component to avoid CSS module issues
import { Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { FoodsProvider } from "@/hooks/use-foods"
import { useCopilotAction } from "@copilotkit/react-core";
import { AddFoods } from "@/components/ai-chat/chat-sidebar/components/AddFoods";
import { FoodCard } from "@/components/ui/FoodCard";
import { Food } from "@/lib/types";
import { MapPin, Info } from "lucide-react";


interface ChatSidebarProps {
  children: React.ReactNode
}


type AgentState = {
  observed_food: string;
};

export function ChatSidebar({ children }: ChatSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [defaultLayout, setDefaultLayout] = useState([65, 35])
  const [layout, setLayout] = useState(defaultLayout)
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Reset layout when sidebar is closed
  useEffect(() => {
    if (!isSidebarOpen) {
      setLayout(defaultLayout)
    }
  }, [isSidebarOpen, defaultLayout])

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
        onLayout={(sizes) => {
          setLayout(sizes)
        }}
      >
        <ResizablePanel
          defaultSize={layout[0]}
          minSize={50}
          className={cn(
            "sidebar-transition",
            isSidebarOpen ? "w-[calc(100%-350px)]" : "w-full"
          )}
        >
          {children}
        </ResizablePanel>
        
        {isSidebarOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={layout[1]}
              minSize={20}
              maxSize={50}
              className="bg-background border-l border-border sidebar-transition"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-medium">EventFlow Assistant</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0, 0, 0, 0.1) transparent'
                }}>
                  <div className="h-full flex flex-col">
                    <main>
                      <YourMainContent />
                      <CopilotChat
                            labels={{
                              title: "EventFlow Assistant",
                              initial: "Hi! 👋 How can I help you plan your event today?",
                            }}
                            className="bg-background border-none z-50 h-full [&_.copilotKitInputContainer]:h-auto [&_.copilotKitInput_textarea]:min-h-[40px] [&_.copilotKitInput_textarea]:max-h-[120px] [&_.copilotKitInput_textarea]:resize-none"
                          />
                    </main>

                  </div>
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Floating Assistant Button */}
      {!isSidebarOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 p-0 flex items-center justify-center"
        >
          <Bot className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}


function YourMainContent() {

  useCopilotAction({ 
    name: "search_for_food",
    description: "Add food items to the event menu",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The query to fetch food items for the event",
        required: true,
      },
      {
        name: "foods",
        type: "object[]",
        description: "The food items to add to the event",
      }
    ],
    render: ({args}) => {

      console.log(args)

      return (
        <p className="text-gray-500 mt-2">
          {status !== "complete" && "Preparin your menu..."}
          {status === "complete" && `Got results for ${args.query}.`}
        </p>
      );
    },
  });


  return null;
}

