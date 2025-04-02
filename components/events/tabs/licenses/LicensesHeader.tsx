"use client"

import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

interface LicensesHeaderProps {
  onExport: () => void
  onAddLicense: () => void
}

export function LicensesHeader({ onExport, onAddLicense }: LicensesHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold">Licenses &amp; Permits</h2>
        <p className="text-muted-foreground">Manage all legal requirements for your event</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="gap-1" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button className="gap-1" onClick={onAddLicense}>
          <Plus className="h-4 w-4" />
          Add License
        </Button>
      </div>
    </div>
  )
}