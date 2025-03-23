"use client"

import { useState, useEffect } from "react"
import { Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AIAssistantIntro() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if the user has seen the intro before
    const hasSeenIntro = localStorage.getItem("hasSeenAIIntro")

    if (!hasSeenIntro) {
      // Show the intro after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)

    // Hide the component after animation completes
    setTimeout(() => {
      setIsVisible(false)
      // Remember that the user has seen the intro
      localStorage.setItem("hasSeenAIIntro", "true")
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 z-40 w-72 transition-all duration-300",
        isDismissed ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
      )}
    >
      <Card className="shadow-lg border-t-4 border-t-evenflow-purple">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-evenflow-gradient p-1.5">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base">AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Your event planning companion</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 text-sm">
          <p>Need help planning your event? Ask me anything about venues, catering, guest management, or scheduling!</p>
        </CardContent>
        <CardFooter>
          <Button
            size="sm"
            className="w-full gap-2 bg-evenflow-gradient hover:bg-evenflow-gradient-hover border-0"
            onClick={handleDismiss}
          >
            <Bot className="h-4 w-4" />
            Try AI Assistant
          </Button>
        </CardFooter>
      </Card>

      <div className="absolute -bottom-5 right-10 h-5 w-5 rotate-45 bg-background"></div>
    </div>
  )
}

