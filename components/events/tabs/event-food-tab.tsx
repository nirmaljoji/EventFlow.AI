import { UtensilsCrossed, Wine, ShoppingBasket, Plus, Trash2, Edit } from "lucide-react"
import { useMemo } from "react"
import { useState, useEffect } from "react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import { useFoods } from "@/hooks/use-foods"
import { Food } from "@/lib/types"

// Define types based on your API
interface MenuItem {
  id: number
  name: string
  type: string
  dietary: string
  status: string
}

interface Beverage {
  name: string
  category: string
  serving: string
  status: string
}

interface Vendor {
  name: string
  type: string
  contact: string
  phone: string
  status: string
  progress: number
}

interface FoodSummary {
  budget: number
  budget_percentage: number
  vendor_count: number
  vendor_status: string
  menu_item_count: number
  dietary_options_count: number
  status: string
  last_updated: string
}

interface EventFoodData {
  summary: FoodSummary
  menu_items: MenuItem[]
  beverages: Beverage[]
  vendors: Vendor[]
}

interface EventFoodTabProps {
  event: Event
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function EventFoodTab({ event }: EventFoodTabProps) {
  const { toast } = useToast()
  const { foods } = useFoods()
  const [foodData, setFoodData] = useState<EventFoodData | null>(null)
  const [loading, setLoading] = useState(true)
  const [localFoods, setLocalFoods] = useState<MenuItem[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Get event_id from event prop
  const event_id = event.id
  
  // Dialog states
  const [menuItemDialogOpen, setMenuItemDialogOpen] = useState(false)
  const [beverageDialogOpen, setBeverageDialogOpen] = useState(false)
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false)
  
  // Form states
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: Date.now(),
    name: "",
    type: "Main",
    dietary: "None",
    status: "Pending"
  })
  
  const [newBeverage, setNewBeverage] = useState<Beverage>({
    name: "",
    category: "Non-Alcoholic",
    serving: "Glass",
    status: "Pending"
  })
  
  const [newVendor, setNewVendor] = useState<Vendor>({
    name: "",
    type: "",
    contact: "",
    phone: "",
    status: "In Progress",
    progress: 0
  })

  // Edit mode tracking states
  const [isEditingMenuItem, setIsEditingMenuItem] = useState(false)
  const [editingMenuItemIndex, setEditingMenuItemIndex] = useState<number | null>(null)
  
  const [isEditingBeverage, setIsEditingBeverage] = useState(false)
  const [editingBeverageIndex, setEditingBeverageIndex] = useState<number | null>(null)
  
  const [isEditingVendor, setIsEditingVendor] = useState(false)
  const [editingVendorIndex, setEditingVendorIndex] = useState<number | null>(null)

  // Get token from local storage
  const getToken = () => {
    return localStorage.getItem("token")
  }

  // Fetch food data for the event
  const fetchFoodData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`${apiUrl}/api/events/${event_id}/food-data`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("You are not authorized to view this event's food details")
        }
        throw new Error("Failed to fetch food data")
      }

      const data = await response.json()
      setFoodData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load food data"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (event_id) {
      fetchFoodData()
    }
  }, [event_id])

  useEffect(() => {
    if (foods && foods.length > 0) {
      const newMenuItems = foods.map(food => ({
        id: food.id,
        name: food.name,
        type: food.type,
        dietary: food.dietary,
        status: 'Pending'
      }))
      
      setLocalFoods(newMenuItems)
    }
  }, [foods])

  const mergedMenuItems = useMemo(() => {
    if (!foodData) return localFoods
    return [...foodData.menu_items, ...localFoods]
  }, [foodData, localFoods])

  // Function to format last updated date
  const formatLastUpdated = (dateString: string) => {
    try {
      return `Last updated ${formatDistanceToNow(new Date(dateString), { addSuffix: true })}`
    } catch (err) {
      return "Last updated recently"
    }
  }

  // Function to handle editing menu item
  const handleEditMenuItem = (index: number) => {
    if (foodData) {
      setNewMenuItem({...foodData.menu_items[index]})
      setIsEditingMenuItem(true)
      setEditingMenuItemIndex(index)
      setMenuItemDialogOpen(true)
    }
  }

  // Function to handle editing beverage
  const handleEditBeverage = (index: number) => {
    if (foodData) {
      setNewBeverage({...foodData.beverages[index]})
      setIsEditingBeverage(true)
      setEditingBeverageIndex(index)
      setBeverageDialogOpen(true)
    }
  }

  // Function to handle editing vendor
  const handleEditVendor = (index: number) => {
    if (foodData) {
      setNewVendor({...foodData.vendors[index]})
      setIsEditingVendor(true)
      setEditingVendorIndex(index)
      setVendorDialogOpen(true)
    }
  }

  // Reset form function for menu items
  const resetMenuItemForm = () => {
    setNewMenuItem({
      id: Date.now(),
      name: "",
      type: "Main",
      dietary: "None",
      status: "Pending"
    })
    setIsEditingMenuItem(false)
    setEditingMenuItemIndex(null)
  }

  // Reset form function for beverages
  const resetBeverageForm = () => {
    setNewBeverage({
      name: "",
      category: "Non-Alcoholic",
      serving: "Glass",
      status: "Pending"
    })
    setIsEditingBeverage(false)
    setEditingBeverageIndex(null)
  }

  // Reset form function for vendors
  const resetVendorForm = () => {
    setNewVendor({
      name: "",
      type: "",
      contact: "",
      phone: "",
      status: "In Progress",
      progress: 0
    })
    setIsEditingVendor(false)
    setEditingVendorIndex(null)
  }

  // Function to handle adding menu item
  const handleAddMenuItem = async () => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      if (isEditingMenuItem && editingMenuItemIndex !== null && foodData) {
        // Update existing menu item
        const response = await fetch(`${apiUrl}/api/events/${event_id}/menu-items/${editingMenuItemIndex}`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newMenuItem)
        })
        
        if (!response.ok) {
          throw new Error("Failed to update menu item")
        }
        
        const updatedItem = await response.json()
        
        // Update local state
        const updatedMenuItems = [...foodData.menu_items]
        updatedMenuItems[editingMenuItemIndex] = updatedItem
        setFoodData({
          ...foodData,
          menu_items: updatedMenuItems
        })
        
        toast({
          title: "Success",
          description: "Menu item updated successfully"
        })
      } else if (foodData) {
        // Add new menu item
        const response = await fetch(`${apiUrl}/api/events/${event_id}/menu-items`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newMenuItem)
        })
        
        if (!response.ok) {
          throw new Error("Failed to add menu item")
        }
        
        const addedItem = await response.json()
        
        // Update local state
        setFoodData({
          ...foodData,
          menu_items: [...foodData.menu_items, addedItem],
          summary: {
            ...foodData.summary,
            menu_item_count: foodData.summary.menu_item_count + 1,
            dietary_options_count: foodData.summary.dietary_options_count + (newMenuItem.dietary !== "None" ? 1 : 0)
          }
        })
        
        toast({
          title: "Success",
          description: "Menu item added successfully"
        })
      }
      
      // Reset form and close dialog
      resetMenuItemForm()
      setMenuItemDialogOpen(false)
      
    } catch (err) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to process menu item"
      })
    }
  }

  const handleDeleteMenuItem = async (index: number) => {
    try {
      const token = getToken()
      
      if (!token || !foodData) {
        throw new Error("Authentication token not found")
      }
      
      const response = await fetch(`${apiUrl}/api/events/${event_id}/menu-items/${index}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete menu item")
      }
      
      // Update local state
      const deletedItem = foodData.menu_items[index]
      const updatedMenuItems = foodData.menu_items.filter((_, i) => i !== index)
      setFoodData({
        ...foodData,
        menu_items: updatedMenuItems,
        summary: {
          ...foodData.summary,
          menu_item_count: foodData.summary.menu_item_count - 1,
          dietary_options_count: foodData.summary.dietary_options_count - (deletedItem.dietary !== "None" ? 1 : 0)
        }
      })
      
      toast({
        title: "Success",
        description: "Menu item deleted successfully"
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete menu item"
      })
    }
  }

  const handleAddBeverage = async () => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      if (isEditingBeverage && editingBeverageIndex !== null && foodData) {
        // Update existing beverage
        const response = await fetch(`${apiUrl}/api/events/${event_id}/beverages/${editingBeverageIndex}`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newBeverage)
        })
        
        if (!response.ok) {
          throw new Error("Failed to update beverage")
        }
        
        const updatedBeverage = await response.json()
        
        // Update local state
        const updatedBeverages = [...foodData.beverages]
        updatedBeverages[editingBeverageIndex] = updatedBeverage
        setFoodData({
          ...foodData,
          beverages: updatedBeverages
        })
        
        toast({
          title: "Success",
          description: "Beverage updated successfully"
        })
      } else if (foodData) {
        // Add new beverage
        const response = await fetch(`${apiUrl}/api/events/${event_id}/beverages`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newBeverage)
        })
        
        if (!response.ok) {
          throw new Error("Failed to add beverage")
        }
        
        const addedBeverage = await response.json()
        
        // Update local state
        setFoodData({
          ...foodData,
          beverages: [...foodData.beverages, addedBeverage]
        })
        
        toast({
          title: "Success",
          description: "Beverage added successfully"
        })
      }
      
      // Reset form and close dialog
      resetBeverageForm()
      setBeverageDialogOpen(false)
      
    } catch (err) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to process beverage"
      })
    }
  }

  const handleDeleteBeverage = async (index: number) => {
    try {
      const token = getToken()
      
      if (!token || !foodData) {
        throw new Error("Authentication token not found")
      }
      
      const response = await fetch(`${apiUrl}/api/events/${event_id}/beverages/${index}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete beverage")
      }
      
      // Update local state
      setFoodData({
        ...foodData,
        beverages: foodData.beverages.filter((_, i) => i !== index)
      })
      
      toast({
        title: "Success",
        description: "Beverage deleted successfully"
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete beverage"
      })
    }
  }

  const handleAddVendor = async () => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      if (isEditingVendor && editingVendorIndex !== null && foodData) {
        // Update existing vendor
        const response = await fetch(`${apiUrl}/api/events/${event_id}/vendors/${editingVendorIndex}`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newVendor)
        })
        
        if (!response.ok) {
          throw new Error("Failed to update vendor")
        }
        
        const updatedVendor = await response.json()
        
        // Update local state
        const updatedVendors = [...foodData.vendors]
        updatedVendors[editingVendorIndex] = updatedVendor
        setFoodData({
          ...foodData,
          vendors: updatedVendors,
          summary: {
            ...foodData.summary,
            vendor_status: updatedVendors.every(v => v.status === "Confirmed") ? "All contracts signed" : "In progress"
          }
        })
        
        toast({
          title: "Success",
          description: "Vendor updated successfully"
        })
      } else if (foodData) {
        // Add new vendor
        const response = await fetch(`${apiUrl}/api/events/${event_id}/vendors`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newVendor)
        })
        
        if (!response.ok) {
          throw new Error("Failed to add vendor")
        }
        
        const addedVendor = await response.json()
        
        // Update local state
        setFoodData({
          ...foodData,
          vendors: [...foodData.vendors, addedVendor],
          summary: {
            ...foodData.summary,
            vendor_count: foodData.summary.vendor_count + 1,
            vendor_status: "In progress"
          }
        })
        
        toast({
          title: "Success",
          description: "Vendor added successfully"
        })
      }
      
      // Reset form and close dialog
      resetVendorForm()
      setVendorDialogOpen(false)
      
    } catch (err) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to process vendor"
      })
    }
  }

  const handleDeleteVendor = async (index: number) => {
    try {
      const token = getToken()
      
      if (!token || !foodData) {
        throw new Error("Authentication token not found")
      }
      
      const response = await fetch(`${apiUrl}/api/events/${event_id}/vendors/${index}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete vendor")
      }
      
      // Update local state
      const updatedVendors = foodData.vendors.filter((_, i) => i !== index)
      setFoodData({
        ...foodData,
        vendors: updatedVendors,
        summary: {
          ...foodData.summary,
          vendor_count: foodData.summary.vendor_count - 1,
          vendor_status: updatedVendors.length === 0 ? "Not started" : 
                        updatedVendors.every(v => v.status === "Confirmed") ? "All contracts signed" : "In progress"
        }
      })
      
      toast({
        title: "Success",
        description: "Vendor deleted successfully"
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete vendor"
      })
    }
  }

  // Handle dialog close for menu items
  const handleMenuItemDialogClose = () => {
    resetMenuItemForm()
    setMenuItemDialogOpen(false)
  }

  // Handle dialog close for beverages
  const handleBeverageDialogClose = () => {
    resetBeverageForm()
    setBeverageDialogOpen(false)
  }

  // Handle dialog close for vendors
  const handleVendorDialogClose = () => {
    resetVendorForm()
    setVendorDialogOpen(false)
  }

  // If loading or no data
  if (loading) {
    return <div className="p-8 text-center">Loading food information...</div>
  }

  if (error || !foodData) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || "Unable to load food information"}</p>
        <Button onClick={fetchFoodData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Food & Catering</h2>
          <p className="text-muted-foreground">Manage all food-related aspects of your event</p>
        </div>
        <Button className="gap-1" onClick={() => setVendorDialogOpen(true)}>
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
            <div className="text-2xl font-bold">${foodData.summary.budget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{foodData.summary.budget_percentage}% of total budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foodData.summary.vendor_count}</div>
            <p className="text-xs text-muted-foreground">{foodData.summary.vendor_status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foodData.summary.menu_item_count}</div>
            <p className="text-xs text-muted-foreground">
              Including {foodData.summary.dietary_options_count} special dietary options
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{foodData.summary.status}</div>
            <p className="text-xs text-muted-foreground">
              {formatLastUpdated(foodData.summary.last_updated)}
            </p>
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
                  <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
                    <div className="col-span-2">Item</div>
                    <div>Type</div>
                    <div>Dietary</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>

                  {mergedMenuItems.map((item: MenuItem, index: number) => (
                    <div key={index} className="grid grid-cols-6 items-center px-4 py-3 hover:bg-muted/50">
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
                      <div className="flex items-center space-x-2">
                        {/* Added Edit button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditMenuItem(index)}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteMenuItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="gap-1 w-full"
                onClick={() => {
                  resetMenuItemForm()
                  setMenuItemDialogOpen(true)
                }}
              >
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
                  <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
                    <div className="col-span-2">Item</div>
                    <div>Category</div>
                    <div>Serving</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>

                  {foodData.beverages.map((item, index) => (
                    <div key={index} className="grid grid-cols-6 items-center px-4 py-3 hover:bg-muted/50">
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
                      <div className="flex items-center space-x-2">
                        {/* Added Edit button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditBeverage(index)}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteBeverage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="gap-1 w-full"
                onClick={() => {
                  resetBeverageForm()
                  setBeverageDialogOpen(true)
                }}
              >
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
                {foodData.vendors.map((vendor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{vendor.name}</h3>
                        <p className="text-sm text-muted-foreground">{vendor.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={vendor.status === "Confirmed" ? "default" : "secondary"}
                          className={vendor.status === "Confirmed" ? "bg-green-500" : ""}
                        >
                          {vendor.status}
                        </Badge>
                        {/* Added Edit button */}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditVendor(index)}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteVendor(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contact:</span> {vendor.contact}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span> {vendor.phone}
                      </div>
                    </div>

                    {/* <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Setup Progress</span>
                        <span>{vendor.progress}%</span>
                      </div>
                      <Progress value={vendor.progress} className="h-1" />
                    </div> */}

                    {index < foodData.vendors.length - 1 && <div className="my-4 border-t" />}
                  </div>
                ))}
                
                {foodData.vendors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No vendors added yet. Click the button below to add your first vendor.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="gap-1 w-full"
                onClick={() => {
                  resetVendorForm()
                  setVendorDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Add Vendor
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Menu Item Dialog */}
      <Dialog open={menuItemDialogOpen} onOpenChange={handleMenuItemDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingMenuItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input 
                id="item-name" 
                placeholder="Enter item name" 
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-type">Type</Label>
              <Select 
                value={newMenuItem.type}
                onValueChange={(value) => setNewMenuItem({...newMenuItem, type: value})}
              >
                <SelectTrigger id="item-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Main">Main</SelectItem>
                  <SelectItem value="Side">Side</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-dietary">Dietary Option</Label>
              <Select 
                value={newMenuItem.dietary}
                onValueChange={(value) => setNewMenuItem({...newMenuItem, dietary: value})}
              >
                <SelectTrigger id="item-dietary">
                  <SelectValue placeholder="Select dietary option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Vegan">Vegan</SelectItem>
                  <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                  <SelectItem value="Dairy-Free">Dairy-Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-status">Status</Label>
              <Select 
                value={newMenuItem.status}
                onValueChange={(value) => setNewMenuItem({...newMenuItem, status: value})}
              >
                <SelectTrigger id="item-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleMenuItemDialogClose}>Cancel</Button>
            <Button onClick={handleAddMenuItem}>{isEditingMenuItem ? "Update" : "Add"} Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Beverage Dialog */}
      <Dialog open={beverageDialogOpen} onOpenChange={handleBeverageDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingBeverage ? "Edit Beverage" : "Add Beverage"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="beverage-name">Beverage Name</Label>
              <Input 
                id="beverage-name" 
                placeholder="Enter beverage name" 
                value={newBeverage.name}
                onChange={(e) => setNewBeverage({...newBeverage, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="beverage-category">Category</Label>
              <Select 
                value={newBeverage.category}
                onValueChange={(value) => setNewBeverage({...newBeverage, category: value})}
              >
                <SelectTrigger id="beverage-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-Alcoholic">Non-Alcoholic</SelectItem>
                  <SelectItem value="Alcohol">Alcohol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="beverage-serving">Serving</Label>
              <Select 
                value={newBeverage.serving}
                onValueChange={(value) => setNewBeverage({...newBeverage, serving: value})}
              >
                <SelectTrigger id="beverage-serving">
                  <SelectValue placeholder="Select serving style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Bottle">Bottle</SelectItem>
                  <SelectItem value="Glass/Bottle">Glass/Bottle</SelectItem>
                  <SelectItem value="Self-Service">Self-Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="beverage-status">Status</Label>
              <Select 
                value={newBeverage.status}
                onValueChange={(value) => setNewBeverage({...newBeverage, status: value})}
              >
                <SelectTrigger id="beverage-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleBeverageDialogClose}>Cancel</Button>
            <Button onClick={handleAddBeverage}>{isEditingBeverage ? "Update" : "Add"} Beverage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vendor Dialog */}
      <Dialog open={vendorDialogOpen} onOpenChange={handleVendorDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-name">Vendor Name</Label>
              <Input 
                id="vendor-name" 
                placeholder="Enter vendor name" 
                value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor-type">Type</Label>
              <Input 
                id="vendor-type" 
                placeholder="E.g., Main Caterer, Desserts, Beverages" 
                value={newVendor.type}
                onChange={(e) => setNewVendor({...newVendor, type: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor-contact">Contact Person</Label>
              <Input 
                id="vendor-contact" 
                placeholder="Contact name" 
                value={newVendor.contact}
                onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor-phone">Phone Number</Label>
              <Input 
                id="vendor-phone" 
                placeholder="(555) 123-4567" 
                value={newVendor.phone}
                onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor-status">Status</Label>
              <Select 
                value={newVendor.status}
                onValueChange={(value) => setNewVendor({...newVendor, status: value})}
              >
                <SelectTrigger id="vendor-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* <div className="space-y-2">
              <Label htmlFor="vendor-progress">Progress (%)</Label>
              <Input 
                id="vendor-progress" 
                type="number"
                min="0"
                max="100"
                placeholder="0" 
                value={newVendor.progress.toString()}
                onChange={(e) => setNewVendor({...newVendor, progress: parseInt(e.target.value) || 0})}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleVendorDialogClose}>Cancel</Button>
            <Button onClick={handleAddVendor}>{isEditingVendor ? "Update" : "Add"} Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}