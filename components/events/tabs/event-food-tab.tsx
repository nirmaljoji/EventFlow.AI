import { UtensilsCrossed, Wine, ShoppingBasket, Plus } from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EventFoodTabProps {
  event: Event
}

export function EventFoodTab({ event }: EventFoodTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Food & Catering</h2>
          <p className="text-muted-foreground">Manage all food-related aspects of your event</p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,500</div>
            <p className="text-xs text-muted-foreground">30% of total budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All contracts signed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Including 6 special dietary options</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Confirmed</div>
            <p className="text-xs text-muted-foreground">Last updated 3 days ago</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="menu" className="gap-1">
            <UtensilsCrossed className="h-4 w-4" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="beverages" className="gap-1">
            <Wine className="h-4 w-4" />
            Beverages
          </TabsTrigger>
          <TabsTrigger value="vendors" className="gap-1">
            <ShoppingBasket className="h-4 w-4" />
            Vendors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Planning</CardTitle>
              <CardDescription>Manage food options for your event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                    <div className="col-span-2">Item</div>
                    <div>Type</div>
                    <div>Dietary</div>
                    <div>Status</div>
                  </div>

                  {[
                    { name: "Grilled Salmon", type: "Main", dietary: "Gluten-Free", status: "Approved" },
                    { name: "Mushroom Risotto", type: "Main", dietary: "Vegetarian", status: "Approved" },
                    { name: "Caesar Salad", type: "Starter", dietary: "None", status: "Approved" },
                    { name: "Chocolate Mousse", type: "Dessert", dietary: "None", status: "Pending" },
                    { name: "Vegan Curry", type: "Main", dietary: "Vegan", status: "Approved" },
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-5 items-center px-4 py-3 hover:bg-muted/50">
                      <div className="col-span-2 font-medium">{item.name}</div>
                      <div>{item.type}</div>
                      <div>
                        {item.dietary !== "None" && (
                          <Badge variant="outline" className="font-normal">
                            {item.dietary}
                          </Badge>
                        )}
                        {item.dietary === "None" && <span>—</span>}
                      </div>
                      <div>
                        <Badge
                          variant={item.status === "Approved" ? "default" : "secondary"}
                          className={item.status === "Approved" ? "bg-green-500" : ""}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-1 w-full">
                <Plus className="h-4 w-4" />
                Add Menu Item
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="beverages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beverage Planning</CardTitle>
              <CardDescription>Manage drinks and bar service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                    <div className="col-span-2">Item</div>
                    <div>Category</div>
                    <div>Serving</div>
                    <div>Status</div>
                  </div>

                  {[
                    { name: "House Red Wine", category: "Alcohol", serving: "Glass/Bottle", status: "Approved" },
                    { name: "Craft Beer Selection", category: "Alcohol", serving: "Bottle", status: "Approved" },
                    { name: "Sparkling Water", category: "Non-Alcoholic", serving: "Bottle", status: "Approved" },
                    { name: "Signature Cocktail", category: "Alcohol", serving: "Glass", status: "Pending" },
                    {
                      name: "Coffee & Tea Station",
                      category: "Non-Alcoholic",
                      serving: "Self-Service",
                      status: "Approved",
                    },
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-5 items-center px-4 py-3 hover:bg-muted/50">
                      <div className="col-span-2 font-medium">{item.name}</div>
                      <div>{item.category}</div>
                      <div>{item.serving}</div>
                      <div>
                        <Badge
                          variant={item.status === "Approved" ? "default" : "secondary"}
                          className={item.status === "Approved" ? "bg-green-500" : ""}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-1 w-full">
                <Plus className="h-4 w-4" />
                Add Beverage
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catering Vendors</CardTitle>
              <CardDescription>Manage your food service providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    name: "Gourmet Delights Catering",
                    type: "Main Caterer",
                    contact: "John Smith",
                    phone: "(555) 123-4567",
                    status: "Confirmed",
                    progress: 100,
                  },
                  {
                    name: "Sweet Sensations Bakery",
                    type: "Desserts",
                    contact: "Maria Garcia",
                    phone: "(555) 987-6543",
                    status: "Confirmed",
                    progress: 100,
                  },
                  {
                    name: "Elite Bar Services",
                    type: "Beverages",
                    contact: "David Johnson",
                    phone: "(555) 456-7890",
                    status: "In Progress",
                    progress: 75,
                  },
                ].map((vendor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{vendor.name}</h3>
                        <p className="text-sm text-muted-foreground">{vendor.type}</p>
                      </div>
                      <Badge
                        variant={vendor.status === "Confirmed" ? "default" : "secondary"}
                        className={vendor.status === "Confirmed" ? "bg-green-500" : ""}
                      >
                        {vendor.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contact:</span> {vendor.contact}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span> {vendor.phone}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Setup Progress</span>
                        <span>{vendor.progress}%</span>
                      </div>
                      <Progress value={vendor.progress} className="h-1" />
                    </div>

                    {index < 2 && <div className="my-4 border-t" />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-1 w-full">
                <Plus className="h-4 w-4" />
                Add Vendor
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

