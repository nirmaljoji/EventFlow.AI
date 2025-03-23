"use client"

import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MyAssistant } from "@/components/ai-chat/chat-assistant/MyAssistant"

interface AiChatPanelProps {
  onClose: () => void
}

export function AiChatPanel({ onClose }: AiChatPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-none flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Event Planning Assistant</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <MyAssistant />
      </div>
    </div>
  )
}

