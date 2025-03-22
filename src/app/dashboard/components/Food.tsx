import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Coffee, 
  Utensils, 
  Store, 
  ShoppingBag, 
  CheckCircle, 
  Search, 
  Heart, 
  DollarSign, 
  Clock, 
  AlertCircle,
  X,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Food() {
  // Sample data - in a real app this would come from your backend
  const [selectedFoods, setSelectedFoods] = useState([
    { id: 1, name: "Grilled Salmon", price: 24.99, category: "Main Course", restaurant: "Ocean Delights", quantity: 50 },
    { id: 2, name: "Chocolate Mousse", price: 8.50, category: "Dessert", restaurant: "Sweet Treats", quantity: 60 },
    { id: 3, name: "Caesar Salad", price: 6.99, category: "Appetizer", restaurant: "Fresh Greens", quantity: 40 }
  ]);

  const [selectedDrinks, setSelectedDrinks] = useState([
    { id: 1, name: "Champagne", price: 35.00, category: "Alcoholic", quantity: 20, servingSize: "750ml Bottle" },
    { id: 2, name: "Sparkling Water", price: 2.50, category: "Non-Alcoholic", quantity: 100, servingSize: "500ml Bottle" },
    { id: 3, name: "Signature Cocktail", price: 12.00, category: "Alcoholic", quantity: 80, servingSize: "Glass" }
  ]);

  const [restaurants, setRestaurants] = useState([
    { 
      id: 1, 
      name: "Ocean Delights", 
      cuisine: "Seafood", 
      rating: 4.7, 
      pricePerPerson: 32, 
      logo: "/api/placeholder/40/40", 
      specialties: ["Grilled Salmon", "Lobster Bisque", "Shrimp Scampi"],
      featured: true
    },
    { 
      id: 2, 
      name: "Sweet Treats", 
      cuisine: "Desserts", 
      rating: 4.9, 
      pricePerPerson: 15, 
      logo: "/api/placeholder/40/40", 
      specialties: ["Chocolate Mousse", "Tiramisu", "Crème Brûlée"],
      featured: false
    },
    { 
      id: 3, 
      name: "Fresh Greens", 
      cuisine: "Salads & Healthy", 
      rating: 4.5, 
      pricePerPerson: 18, 
      logo: "/api/placeholder/40/40", 
      specialties: ["Caesar Salad", "Greek Salad", "Quinoa Bowl"],
      featured: true
    },
    { 
      id: 4, 
      name: "Spice Kingdom", 
      cuisine: "Indian", 
      rating: 4.8, 
      pricePerPerson: 25, 
      logo: "/api/placeholder/40/40", 
      specialties: ["Butter Chicken", "Vegetable Biryani", "Naan Bread"],
      featured: false
    }
  ]);

  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: "Paper Napkins", quantity: 300, purchased: false, category: "Supplies" },
    { id: 2, name: "Cocktail Stirrers", quantity: 100, purchased: true, category: "Bar Supplies" },
    { id: 3, name: "Lemon", quantity: 40, purchased: false, category: "Ingredients" },
    { id: 4, name: "Ice", quantity: "50 lbs", purchased: false, category: "Bar Supplies" },
    { id: 5, name: "Olive Oil", quantity: "2 bottles", purchased: true, category: "Ingredients" }
  ]);

  const togglePurchasedStatus = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? {...item, purchased: !item.purchased} : item
    ));
  };

  const getTotalCost = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const getCompletedPercentage = () => {
    const completed = shoppingList.filter(item => item.purchased).length;
    return Math.round((completed / shoppingList.length) * 100);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Food & Beverages
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage all food and beverage aspects of your event
            </p>
          </div>
          <Button className="px-4 py-2 flex items-center gap-2">
            <PlusCircle size={18} />
            Add Menu Item
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Budget</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                    ${(parseFloat(getTotalCost(selectedFoods)) + parseFloat(getTotalCost(selectedDrinks))).toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-800/40 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-100 dark:border-emerald-800">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Shopping Completed</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {getCompletedPercentage()}%
                  </p>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-800/40 p-2 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-100 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Restaurants</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {restaurants.length}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-800/40 p-2 rounded-full">
                  <Store className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <Tabs defaultValue="menu" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="menu" className="px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <div className="flex items-center gap-2">
              <Utensils size={16} />
              <span>Selected Menu</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <div className="flex items-center gap-2">
              <Store size={16} />
              <span>Restaurants</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="shopping" className="px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} />
              <span>Shopping List</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Selected Menu Tab */}
        <TabsContent value="menu" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Food Selection */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-amber-500" />
                      <span>Selected Food</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedFoods.length} items selected - ${getTotalCost(selectedFoods)}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <PlusCircle size={14} />
                    Add Food
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 rounded-md border">
                  <div className="p-4 space-y-3">
                    {selectedFoods.map((food) => (
                      <div key={food.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                            <Utensils className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">{food.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800">
                                {food.category}
                              </Badge>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {food.restaurant}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">${food.price} × {food.quantity}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              ${(food.price * food.quantity).toFixed(2)}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                            <X size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Drink Selection */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="h-5 w-5 text-blue-500" />
                      <span>Selected Drinks</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedDrinks.length} items selected - ${getTotalCost(selectedDrinks)}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <PlusCircle size={14} />
                    Add Drink
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 rounded-md border">
                  <div className="p-4 space-y-3">
                    {selectedDrinks.map((drink) => (
                      <div key={drink.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                            <Coffee className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">{drink.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800">
                                {drink.category}
                              </Badge>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {drink.servingSize}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">${drink.price} × {drink.quantity}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              ${(drink.price * drink.quantity).toFixed(2)}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                            <X size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Restaurants Tab */}
        <TabsContent value="restaurants">
          <div className="mb-6 flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input 
                type="text" 
                placeholder="Search restaurants..." 
                className="pl-8 pr-4 py-2 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <PlusCircle size={16} />
              Add New Restaurant
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className={restaurant.featured ? "border-amber-200 dark:border-amber-800" : ""}>
                {restaurant.featured && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-amber-500">Featured</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={restaurant.logo} alt={restaurant.name} />
                      <AvatarFallback>{restaurant.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{restaurant.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {restaurant.cuisine}
                        </Badge>
                        <div className="flex items-center text-amber-500">
                          <span className="text-xs font-medium mr-1">{restaurant.rating}</span>
                          ★
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                      <span className="text-sm">Avg. ${restaurant.pricePerPerson} per person</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-xs justify-between">
                    <span>View Menu</span>
                    <ChevronRight size={14} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shopping List Tab */}
        <TabsContent value="shopping">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-emerald-500" />
                    <span>Shopping List</span>
                  </CardTitle>
                  <CardDescription>
                    {shoppingList.filter(item => item.purchased).length} of {shoppingList.length} items purchased
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-1">
                  <PlusCircle size={14} />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-slate-900 dark:text-slate-100">Items to Purchase</h3>
                  <div className="space-y-2">
                    {shoppingList.filter(item => !item.purchased).map((item) => (
                      <div key={item.id} className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 mr-2 text-slate-400 hover:text-emerald-500"
                          onClick={() => togglePurchasedStatus(item.id)}
                        >
                          <div className="h-5 w-5 rounded-full border-2 border-current" />
                        </Button>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 text-slate-900 dark:text-slate-100">Purchased Items</h3>
                  <div className="space-y-2">
                    {shoppingList.filter(item => item.purchased).map((item) => (
                      <div key={item.id} className="flex items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-70">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 mr-2 text-emerald-500"
                          onClick={() => togglePurchasedStatus(item.id)}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-100 line-through">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs opacity-70">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}