"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X, Sparkles, Bot, ChevronRight, Paperclip, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your AI event planning assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "I can help you plan your event! What type of event are you organizing?",
        "Would you like me to suggest some venues based on your event requirements?",
        "I can help you create a timeline for your event planning process.",
        "Need help with guest management or catering options? Just ask!",
        "I can provide templates for event invitations if you need them.",
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
  }

  return (
    <>
      {/* Chat Button */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center transition-all duration-300",
          isOpen && !isMinimized ? "right-[384px]" : "right-6",
        )}
      >
        <div
          className={cn(
            "absolute right-full mr-4 rounded-full bg-white px-3 py-1.5 shadow-md transition-opacity duration-300",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
        >
          <p className="text-sm font-medium">Ask AI Assistant</p>
        </div>

        <Button
          onClick={toggleChat}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-evenflow-gradient hover:bg-evenflow-gradient-hover border-0"
        >
          {isOpen && !isMinimized ? <ChevronRight className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </Button>
      </div>

      {/* Minimized Chat Indicator */}
      {isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 cursor-pointer" onClick={maximizeChat}>
          <div className="flex items-center gap-2 rounded-full bg-evenflow-gradient px-4 py-2 text-white shadow-lg">
            <Bot className="h-5 w-5" />
            <span className="font-medium">AI Assistant</span>
            <Badge variant="secondary" className="bg-white text-evenflow-blue">
              1
            </Badge>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-40 h-[calc(100vh-5rem)] w-[380px] flex flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out",
          isOpen && !isMinimized ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between bg-evenflow-gradient px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
              <AvatarFallback className="bg-evenflow-indigo text-white">AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">AI Event Assistant</h3>
              <p className="text-xs text-white/70">Powered by EvenFlow.AI</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={minimizeChat}>
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex w-full gap-2", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
                    <AvatarFallback className="bg-evenflow-blue text-white">AI</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2",
                    message.role === "user" ? "bg-evenflow-gradient text-white" : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="mt-1 text-right text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=U" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="pr-10"
              />
              <Sparkles className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button
              className="shrink-0 bg-evenflow-gradient hover:bg-evenflow-gradient-hover border-0"
              onClick={handleSendMessage}
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Ask about event planning, guest management, or venue recommendations
          </p>
        </div>
      </div>

      {/* Pulse Animation for New Users */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full transition-opacity duration-300",
          isOpen ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-evenflow-blue opacity-20"></span>
      </div>
    </>
  )
}

