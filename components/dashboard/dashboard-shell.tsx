"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface DashboardShellProps {
  children?: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter()

  useEffect(() => {
    // Check for token in localStorage instead of using auth context
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 p-4 md:p-8">
      <main className="flex flex-1 flex-col gap-4">{children}</main>
    </div>
  )
}

