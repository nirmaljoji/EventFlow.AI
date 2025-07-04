"use client"

import { useState } from "react"
import { Search, Filter, Grid3X3, List, SlidersHorizontal, Plus, Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VendorCard } from "./vendor-card"
import { mockVendors } from "@/lib/mock-vendors"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddVendorDialog } from "./add-vendor-dialog"

export default function VendorsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isAddVendorDialogOpen, setIsAddVendorDialogOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  // Get unique categories, price ranges, and locations for filters
  const categories = Array.from(new Set(mockVendors.map((vendor) => vendor.category)))
  const locations = Array.from(new Set(mockVendors.map((vendor) => vendor.location.city)))

  // Filter vendors based on search query, category, and other filters
  const filteredVendors = mockVendors.filter((vendor) => {
    // Search filter
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false

    if (!matchesSearch) return false

    // Category filter
    if (activeCategory !== "all" && vendor.category !== activeCategory) {
      return false
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      if (!selectedPriceRanges.includes(vendor.priceRange)) {
        return false
      }
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      if (!selectedRatings.includes(Math.floor(vendor.rating))) {
        return false
      }
    }

    // Location filter
    if (selectedLocations.length > 0) {
      if (!selectedLocations.includes(vendor.location.city)) {
        return false
      }
    }

    return true
  })

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Vendors" text="Browse and manage vendors for your events">
          <Button
            onClick={() => setIsAddVendorDialogOpen(true)}
            className="gap-1 bg-evenflow-gradient hover:bg-evenflow-gradient-hover border-0"
          >
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </DashboardHeader>

        {/* Search and filters section */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search vendors by name, category, or location..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Tabs
                    defaultValue="all"
                    value={activeCategory}
                    onValueChange={setActiveCategory}
                    className="flex-1"
                  >
                    <TabsList className="w-full justify-start overflow-x-auto">
                      <TabsTrigger value="all" className="shrink-0">All</TabsTrigger>
                      {categories.slice(0, 3).map((category) => (
                        <TabsTrigger key={category} value={category} className="shrink-0">
                          {category}
                        </TabsTrigger>
                      ))}
                      {categories.length > 3 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 shrink-0">
                              More <span className="ml-1">▾</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {categories.slice(3).map((category) => (
                              <DropdownMenuItem
                                key={category}
                                onClick={() => setActiveCategory(category)}
                              >
                                {category}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Filter className="h-4 w-4" />
                          Filters
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["$", "$$", "$$$", "$$$$"].map((price) => (
                          <DropdownMenuCheckboxItem
                            key={price}
                            checked={selectedPriceRanges.includes(price)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPriceRanges([...selectedPriceRanges, price])
                              } else {
                                setSelectedPriceRanges(selectedPriceRanges.filter((p) => p !== price))
                              }
                            }}
                          >
                            {price}
                          </DropdownMenuCheckboxItem>
                        ))}

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Rating</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <DropdownMenuCheckboxItem
                            key={rating}
                            checked={selectedRatings.includes(rating)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRatings([...selectedRatings, rating])
                              } else {
                                setSelectedRatings(selectedRatings.filter((r) => r !== rating))
                              }
                            }}
                          >
                            {rating}+ <Star className="inline-block h-3 w-3 ml-1" />
                          </DropdownMenuCheckboxItem>
                        ))}

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Location</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {locations.map((location) => (
                          <DropdownMenuCheckboxItem
                            key={location}
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLocations([...selectedLocations, location])
                              } else {
                                setSelectedLocations(selectedLocations.filter((l) => l !== location))
                              }
                            }}
                          >
                            {location}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <SlidersHorizontal className="h-4 w-4" />
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuCheckboxItem checked>Name (A-Z)</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Name (Z-A)</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Rating (High-Low)</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Price (Low-High)</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Price (High-Low)</DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex border rounded-md divide-x">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-r-none h-9 w-9"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-l-none h-9 w-9"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results section */}
        <div className="mt-2">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {activeCategory !== "all" && (
                <Badge className="bg-evenflow-blue">
                  {activeCategory}
                </Badge>
              )}
              {selectedPriceRanges.map(price => (
                <Badge key={price} variant="outline" className="border-evenflow-blue text-evenflow-blue">
                  {price}
                </Badge>
              ))}
              {selectedRatings.map(rating => (
                <Badge key={rating} variant="outline" className="border-yellow-400 text-yellow-400">
                  {rating}+ <Star className="inline-block h-3 w-3 ml-1" />
                </Badge>
              ))}
              {selectedLocations.map(location => (
                <Badge key={location} variant="outline" className="border-green-500 text-green-500">
                  <MapPin className="h-3 w-3 mr-1" /> {location}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {filteredVendors.length} vendors
              </div>

              {(activeCategory !== "all" ||
                selectedPriceRanges.length > 0 ||
                selectedRatings.length > 0 ||
                selectedLocations.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveCategory("all")
                    setSelectedPriceRanges([])
                    setSelectedRatings([])
                    setSelectedLocations([])
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-320px)]">
            {filteredVendors.length > 0 ? (
              <div className={`grid gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {filteredVendors.map((vendor) =>
                  viewMode === "grid" ? (
                    <VendorCard key={vendor.id} vendor={vendor} viewMode="grid" />
                  ) : (
                    <VendorCard key={vendor.id} vendor={vendor} viewMode="list" />
                  ),
                )}
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No vendors found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search term</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DashboardShell>

      <AddVendorDialog open={isAddVendorDialogOpen} onOpenChange={setIsAddVendorDialogOpen} />
    </>
  )
}

