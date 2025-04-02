"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import type { License } from "@/lib/types"

interface LicenseManagementToolsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
  licenses: License[]
  filteredLicenses: License[]
  approvedLicenses: License[]
  pendingLicenses: License[]
  missingLicenses: License[]
  rejectedLicenses: License[]
  renderLicenseCard: (license: License) => React.ReactNode
}

export function LicenseManagementTools({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  licenses,
  filteredLicenses,
  approvedLicenses,
  pendingLicenses,
  missingLicenses,
  rejectedLicenses,
  renderLicenseCard
}: LicenseManagementToolsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>License Tracker</CardTitle>
            <CardDescription>Track all permits and licenses for your event</CardDescription>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search licenses..."
                className="pl-8 w-full sm:w-[240px]"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <Select
              value={activeFilter || "all"}
              onValueChange={(value) => onFilterChange(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="venue">Venue</SelectItem>
                <SelectItem value="food">Food & Beverage</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="all">
              All Licenses
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
            </TabsTrigger>
            <TabsTrigger value="missing">
              Missing
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredLicenses.map(renderLicenseCard)}
              {filteredLicenses.length === 0 && (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No licenses found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="grid gap-4">
              {approvedLicenses.map(renderLicenseCard)}
              {approvedLicenses.length === 0 && (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No approved licenses</h3>
                    <p className="text-sm text-muted-foreground">Submit applications to get approvals</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4">
              {pendingLicenses.map(renderLicenseCard)}
              {pendingLicenses.length === 0 && (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No pending licenses</h3>
                    <p className="text-sm text-muted-foreground">All applications have been processed</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="missing" className="space-y-4">
            <div className="grid gap-4">
              {missingLicenses.map(renderLicenseCard)}
              {missingLicenses.length === 0 && (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No missing licenses</h3>
                    <p className="text-sm text-muted-foreground">All required licenses have been applied for</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="grid gap-4">
              {rejectedLicenses.map(renderLicenseCard)}
              {rejectedLicenses.length === 0 && (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No rejected licenses</h3>
                    <p className="text-sm text-muted-foreground">All applications are in good standing</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}