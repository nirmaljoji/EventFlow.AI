"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, MessageSquareText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MyAssistant } from "@/components/ai-chat/chat-assistant/MyAssistant"


export function AiChatSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)

  // Show a pulsing effect for the first time to draw attention
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasBeenOpened) {
        setIsOpen(true)
        setHasBeenOpened(true)
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [hasBeenOpened])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[400px] flex-col border-l bg-background shadow-lg"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Event Planning Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <MyAssistant/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <div className="fixed bottom-6 right-10 z-40">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <Button onClick={() => setIsOpen(true)} size="lg" className="h-14 w-14 rounded-full shadow-lg">
              <MessageSquareText className="h-6 w-6" />
              <span className="sr-only">Open AI Chat</span>
            </Button>
          </motion.div>
          {!hasBeenOpened && (
            <motion.div
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-destructive"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
              }}
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-12 right-0 whitespace-nowrap rounded-lg bg-background px-4 py-2 text-sm font-medium shadow-lg"
          >
            <div className="absolute -bottom-1 right-6 h-2 w-2 rotate-45 bg-background"></div>
            Ask your AI Event Assistant!
          </motion.div>
        </div>
      )}
    </>
  )
}

