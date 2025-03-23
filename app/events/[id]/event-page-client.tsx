"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AiChatPanel } from "@/components/ai-chat/chat-sidebar/ai-chat-panel"
import EventDetails from "@/components/events/event-details"

interface EventPageClientProps {
  event: any // Replace with your event type
}

export default function EventPageClient({ event }: EventPageClientProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <div
        className={`grid h-full transition-all duration-300 ${isPanelOpen ? "grid-cols-[1fr_500px]" : "grid-cols-[1fr_0px]"}`}
      >
        <motion.div layout className="h-full overflow-y-auto">
          <EventDetails event={event} />
        </motion.div>

        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "500px" }}
              exit={{ width: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="h-full border-l bg-background shadow-lg overflow-hidden"
            >
              <AiChatPanel onClose={() => setIsPanelOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isPanelOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <Button onClick={() => setIsPanelOpen(true)} size="lg" className="h-14 w-14 rounded-full shadow-lg">
              <MessageSquareText className="h-6 w-6" />
              <span className="sr-only">Open AI Chat</span>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-12 right-0 whitespace-nowrap rounded-lg bg-background px-4 py-2 text-sm font-medium shadow-lg"
          >
            <div className="absolute -bottom-1 right-6 h-2 w-2 rotate-45 bg-background"></div>
            Ask about this event!
          </motion.div>
        </div>
      )}
    </div>
  )
}

