"use client"

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card"
import { 
  FileCheck, 
  FileClock, 
  FileWarning, 
  ClipboardCheck,
  Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LicenseStatsCardsProps {
  totalLicenses: number
  approvedLicenses: number
  pendingLicenses: number
  missingLicenses: number
  totalCost: number
  paidCost: number
}

export function LicenseStatsCards({
  totalLicenses,
  approvedLicenses,
  pendingLicenses,
  missingLicenses,
  totalCost,
  paidCost
}: LicenseStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalLicenses}</div>
              <p className="text-xs text-muted-foreground">Required for this event</p>
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-primary mt-auto" />
      </Card>

      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 dark:bg-green-900/20">
              <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {approvedLicenses}
                </span>
                <Badge className="bg-green-500">
                  {Math.round((approvedLicenses / totalLicenses) * 100)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-green-500 mt-auto" />
      </Card>

      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-yellow-50 p-2 dark:bg-yellow-900/20">
              <FileClock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {pendingLicenses}
                </span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  {Math.round((pendingLicenses / totalLicenses) * 100)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-yellow-500 mt-auto" />
      </Card>

      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Missing</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-50 p-2 dark:bg-red-900/20">
              <FileWarning className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{missingLicenses}</span>
                <Badge variant="destructive">{Math.round((missingLicenses / totalLicenses) * 100)}%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-red-500 mt-auto" />
      </Card>

      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">${paidCost.toFixed(2)} paid</p>
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-blue-500 mt-auto" />
      </Card>
    </div>
  )
}