"use client" // Make this a client component to use hooks

import React, { useEffect } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { WaitForUserInput } from "@/components/ai-chat/chat-sidebar/components/WaitForUserInput"  
import { ThemeProvider } from "@/components/theme-provider"
import { CopilotKit } from "@copilotkit/react-core"
import { authService } from "@/app/services/auth"
import { logger } from "@/lib/logger"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Proactive token refresh check - runs for all pages
  useEffect(() => {
    // Only check if user is authenticated
    if (authService.isAuthenticated()) {
      // Check immediately on mount
      authService.checkAndRefreshTokenIfNeeded();

      // Set interval to check periodically (e.g., every 60 seconds)
      const intervalId = setInterval(() => {
        logger.info("Running periodic token check...");
        authService.checkAndRefreshTokenIfNeeded();
      }, 60 * 1000); // 60000 ms = 1 minute

      // Clear interval on component unmount
      return () => {
        logger.info("Clearing token check interval.");
        clearInterval(intervalId);
      };
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CopilotKit
            runtimeUrl="/api/copilotkit"
            agent="weather_agent"             
          >
            <WaitForUserInput />
            {children}
          </CopilotKit>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'