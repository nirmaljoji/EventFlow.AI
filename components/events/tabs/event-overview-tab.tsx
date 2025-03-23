import { BarChart3, CheckCircle, Clock, FileText, Users } from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EventOverviewTabProps {
  event: Event
}

export function EventOverviewTab({ event }: EventOverviewTabProps) {
  // Calculate progress for ongoing events
  const calculateProgress = () => {
    const start = new Date(event.startDate).getTime()
    const end = new Date(event.endDate).getTime()
    const now = new Date().getTime()

    return Math.min(Math.round(((now - start) / (end - start)) * 100), 100)
  }

  const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/20</div>
            <p className="text-xs text-muted-foreground">60% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(event.attendees * 0.7)}</div>
            <p className="text-xs text-muted-foreground">70% of expected attendees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">83% of total budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 pending approvals</p>
          </CardContent>
        </Card>
      </div>

      {isOngoing && (
        <Card>
          <CardHeader>
            <CardTitle>Event Progress</CardTitle>
            <CardDescription>Track the overall progress of your event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Overall Completion</span>
                </div>
                <span className="font-medium">{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Planning</span>
                  <span className="font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Logistics</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Marketing</span>
                  <span className="font-medium">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Key information about your event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Organizer</div>
                <div className="col-span-2">{event.organizer}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Event Type</div>
                <div className="col-span-2">Conference</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Start Date</div>
                <div className="col-span-2">{new Date(event.startDate).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">End Date</div>
                <div className="col-span-2">{new Date(event.endDate).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Location</div>
                <div className="col-span-2">{event.location}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Expected Attendees</div>
                <div className="col-span-2">{event.attendees}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Budget</div>
                <div className="col-span-2">$15,000</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-sm">
                <div className="min-w-[40px] rounded-full bg-blue-100 p-2 text-center text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Now
                </div>
                <div>
                  <p className="font-medium">Catering menu confirmed</p>
                  <p className="text-muted-foreground">The final menu has been approved by the client</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-sm">
                <div className="min-w-[40px] rounded-full bg-muted p-2 text-center text-xs font-medium">2h</div>
                <div>
                  <p className="font-medium">5 new guests registered</p>
                  <p className="text-muted-foreground">
                    Total confirmed attendees: {Math.floor(event.attendees * 0.7)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-sm">
                <div className="min-w-[40px] rounded-full bg-muted p-2 text-center text-xs font-medium">1d</div>
                <div>
                  <p className="font-medium">Venue layout finalized</p>
                  <p className="text-muted-foreground">Floor plan has been approved and shared with vendors</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-sm">
                <div className="min-w-[40px] rounded-full bg-muted p-2 text-center text-xs font-medium">3d</div>
                <div>
                  <p className="font-medium">Speaker schedule updated</p>
                  <p className="text-muted-foreground">Two new speakers added to the program</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

