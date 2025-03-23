"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Star, Heart, MoreHorizontal, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Vendor } from "@/lib/types"
import { cn } from "@/lib/utils"

interface VendorCardProps {
  vendor: Vendor
  viewMode: "grid" | "list"
}

export function VendorCard({ vendor, viewMode }: VendorCardProps) {
  const [isFavorite, setIsFavorite] = useState(vendor.isFavorite || false)

  // Function to render rating stars
  const renderRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400 [mask-image:linear-gradient(90deg,#000_50%,transparent_50%)]"
        />,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row">
          <div
            className="h-24 sm:h-auto sm:w-48 bg-cover bg-center"
            style={{
              backgroundImage: `url(${vendor.image || "/placeholder.svg?height=128&width=384&text=Vendor"})`,
            }}
          />
          <CardContent className="flex flex-1 flex-col justify-between p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {renderRatingStars(vendor.rating)}
                    <span className="text-sm text-muted-foreground ml-1">({vendor.reviewCount})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-evenflow-blue">{vendor.category}</Badge>
                  <Badge variant="outline">{vendor.priceRange}</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{vendor.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>
                    {vendor.location.city}, {vendor.location.state}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-1 h-4 w-4" />
                  <span>{vendor.contact.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  Book
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", isFavorite ? "text-red-500" : "")}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={cn("h-4 w-4", isFavorite ? "fill-current" : "")} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Add to Event</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Report Issue</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="p-0">
        <div
          className="h-48 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${vendor.image || "/placeholder.svg?height=192&width=384&text=Vendor"})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-black/20 text-white hover:bg-black/40"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={cn("h-4 w-4", isFavorite ? "fill-white" : "")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 text-white hover:bg-black/40">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Add to Event</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Report Issue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Badge className="bg-evenflow-blue">{vendor.category}</Badge>
              <Badge variant="outline" className="bg-black/30 text-white border-white/30">
                {vendor.priceRange}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{vendor.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              {renderRatingStars(vendor.rating)}
              <span className="text-sm text-muted-foreground ml-1">({vendor.reviewCount})</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">{vendor.description}</p>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4 shrink-0" />
            <span className="truncate">
              {vendor.location.city}, {vendor.location.state}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-1 h-4 w-4 shrink-0" />
            <span className="truncate">{vendor.contact.phone}</span>
          </div>

          {vendor.specialties && vendor.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {vendor.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1 gap-1" size="sm">
          <Calendar className="h-4 w-4" />
          Book
        </Button>
        <Button className="flex-1 gap-1 bg-evenflow-gradient hover:bg-evenflow-gradient-hover border-0" size="sm">
          <Mail className="h-4 w-4" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  )
}

