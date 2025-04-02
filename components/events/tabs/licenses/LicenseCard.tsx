"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Edit,
  Plus,
} from "lucide-react"
import type { License } from "@/lib/types"

interface LicenseCardProps {
  license: License
  isExpanded: boolean
  onToggleExpand: (id: string) => void
  onEditClick: (license: License) => void
  // Add other necessary handlers if needed, e.g., for Apply, Submit, Download
}

// Helper function to get status badge
const getStatusBadge = (status: "approved" | "pending" | "missing" | "rejected") => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-50">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "missing":
      return (
        <Badge variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
          <AlertCircle className="mr-1 h-3 w-3" />
          Missing
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive">
          <X className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
  }
}

export function LicenseCard({ license, isExpanded, onToggleExpand, onEditClick }: LicenseCardProps) {
  return (
    <Card className={`overflow-hidden transition-all ${isExpanded ? "shadow-md" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full p-2 ${
                license.status === "approved"
                  ? "bg-green-50 text-green-600"
                  : license.status === "pending"
                    ? "bg-yellow-50 text-yellow-600"
                    : license.status === "rejected"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50 text-gray-600"
              }`}
            >
              <license.icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{license.name}</CardTitle>
              <CardDescription>{license.type}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(license.status)}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleExpand(license.id)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="pb-3">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{license.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Issuing Authority:</span>{" "}
                  <span className="font-medium">{license.issuingAuthority}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Due Date:</span>{" "}
                  <span className="font-medium">{new Date(license.dueDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>{" "}
                  <span className="font-medium">${license.cost.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Required Documents:</span>{" "}
                  <span className="font-medium">{license.documents.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Application Progress</span>
                  <span className="font-medium">
                    {license.status === "approved"
                      ? "100%"
                      : license.status === "pending"
                        ? "75%"
                        : license.status === "rejected"
                          ? "50%"
                          : "0%"}
                  </span>
                </div>
                <Progress
                  value={
                    license.status === "approved"
                      ? 100
                      : license.status === "pending"
                        ? 75
                        : license.status === "rejected"
                          ? 50
                          : 0
                  }
                  className="h-2"
                />
              </div>

              {/* Required Documents Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Required Documents:</h4>
                <div className="rounded-md border p-3">
                  <ul className="space-y-2 text-sm">
                    {license.documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{doc.name}</span>
                        {doc.uploaded ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Required
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {license.notes && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">Notes:</p>
                  <p>{license.notes}</p>
                </div>
              )}

              {license.rejectionReason && (
                <div className="rounded-md bg-red-50 p-3 text-sm border border-red-200 text-red-700">
                  <p className="font-medium">Rejection Reason:</p>
                  <p>{license.rejectionReason}</p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-0">
             <>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => onEditClick(license)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                {/* Add onClick handlers for other buttons if needed */}
                {license.status === "approved" ? (
                  <Button size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                ) : license.status === "rejected" ? (
                  <Button size="sm" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Resubmit
                  </Button>
                ) : license.status === "missing" ? (
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Apply
                  </Button>
                ) : (
                  <Button size="sm" className="gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Submit
                  </Button>
                )}
              </>
          </CardFooter>
        </>
      )}
    </Card>
  )
}