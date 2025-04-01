"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Download, Edit, Plus, Trash2, Upload, Search } from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface EventBudgetTabProps {
  event: Event
}

// Budget item type definition
type BudgetItem = {
  id: string
  name: string
  category: string
  amount: number
  type: "expense" | "income"
  status: "paid" | "pending" | "overdue"
  dueDate?: string
  notes?: string
  vendor?: string
  paymentMethod?: string
  receiptUrl?: string
  createdAt: string
}

// Budget summary type
type BudgetSummary = {
  totalBudget: number
  totalExpenses: number
  totalIncome: number
  remainingBudget: number
  largestExpenseCategory: string
  largestExpenseAmount: number
  upcomingPayments: number
  overduePayments: number
}

// Generate mock budget data
const generateMockBudgetData = (event: Event): { items: BudgetItem[]; summary: BudgetSummary } => {
  const categories = [
    "Venue",
    "Catering",
    "Decoration",
    "Entertainment",
    "Photography",
    "Videography",
    "Marketing",
    "Transportation",
    "Staff",
    "Equipment",
    "Miscellaneous",
  ]

  const paymentMethods = ["Credit Card", "Bank Transfer", "Cash", "Check", "PayPal"]

  const vendors = [
    "Venue Provider",
    "Catering Co.",
    "Decor Specialists",
    "Sound & Lighting",
    "Photography Studio",
    "Video Productions",
    "Marketing Agency",
    "Transport Services",
    "Staffing Agency",
    "Equipment Rental",
    "Miscellaneous Vendor",
  ]

  const statuses: ("paid" | "pending" | "overdue")[] = ["paid", "pending", "overdue"]

  // Generate expenses
  const expenses: BudgetItem[] = []
  let totalExpenses = 0

  // Ensure we have at least one item in each category for the chart
  categories.forEach((category, index) => {
    const amount = Math.floor(Math.random() * 2000) + 500
    totalExpenses += amount

    expenses.push({
      id: `expense-${index}`,
      name: `${category} ${index === 0 ? "Rental" : "Services"}`,
      category,
      amount,
      type: "expense",
      status: statuses[Math.floor(Math.random() * 3)],
      dueDate: new Date(Date.now() + (Math.floor(Math.random() * 30) - 15) * 24 * 60 * 60 * 1000).toISOString(),
      notes: Math.random() > 0.7 ? `Payment for ${category.toLowerCase()} services` : undefined,
      vendor: vendors[index % vendors.length],
      paymentMethod:
        Math.random() > 0.3 ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
      receiptUrl: Math.random() > 0.6 ? `/receipt-${index}.pdf` : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  })

  // Add some more random expenses
  for (let i = 0; i < 10; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length)
    const amount = Math.floor(Math.random() * 1000) + 100
    totalExpenses += amount

    expenses.push({
      id: `expense-${categories.length + i}`,
      name: `Additional ${categories[categoryIndex]} Expense`,
      category: categories[categoryIndex],
      amount,
      type: "expense",
      status: statuses[Math.floor(Math.random() * 3)],
      dueDate: new Date(Date.now() + (Math.floor(Math.random() * 30) - 15) * 24 * 60 * 60 * 1000).toISOString(),
      notes: Math.random() > 0.7 ? `Additional payment for ${categories[categoryIndex].toLowerCase()}` : undefined,
      vendor: Math.random() > 0.3 ? vendors[categoryIndex % vendors.length] : undefined,
      paymentMethod:
        Math.random() > 0.3 ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
      receiptUrl: Math.random() > 0.6 ? `/receipt-extra-${i}.pdf` : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  // Generate income (sponsorships, ticket sales, etc.)
  const income: BudgetItem[] = []
  let totalIncome = 0

  const incomeCategories = ["Sponsorship", "Ticket Sales", "Donations", "Merchandise"]

  for (let i = 0; i < 5; i++) {
    const categoryIndex = Math.floor(Math.random() * incomeCategories.length)
    const amount = Math.floor(Math.random() * 3000) + 1000
    totalIncome += amount

    income.push({
      id: `income-${i}`,
      name: `${incomeCategories[categoryIndex]} ${i + 1}`,
      category: incomeCategories[categoryIndex],
      amount,
      type: "income",
      status: statuses[Math.floor(Math.random() * 3)],
      dueDate:
        Math.random() > 0.5
          ? new Date(Date.now() + (Math.floor(Math.random() * 30) - 15) * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      notes: Math.random() > 0.7 ? `Income from ${incomeCategories[categoryIndex].toLowerCase()}` : undefined,
      paymentMethod:
        Math.random() > 0.3 ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  // Combine expenses and income
  const allItems = [...expenses, ...income]

  // Calculate category totals for summary
  const categoryTotals: Record<string, number> = {}
  expenses.forEach((item) => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = 0
    }
    categoryTotals[item.category] += item.amount
  })

  // Find largest expense category
  let largestCategory = ""
  let largestAmount = 0

  Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (amount > largestAmount) {
      largestCategory = category
      largestAmount = amount
    }
  })

  // Count upcoming and overdue payments
  const upcomingPayments = allItems.filter(
    (item) =>
      item.status === "pending" &&
      item.dueDate &&
      new Date(item.dueDate) > new Date() &&
      new Date(item.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ).length

  const overduePayments = allItems.filter((item) => item.status === "overdue").length

  // Create summary
  const summary: BudgetSummary = {
    totalBudget: event.budget || 15000,
    totalExpenses,
    totalIncome,
    remainingBudget: (event.budget || 15000) - totalExpenses + totalIncome,
    largestExpenseCategory: largestCategory,
    largestExpenseAmount: largestAmount,
    upcomingPayments,
    overduePayments,
  }

  return {
    items: allItems,
    summary,
  }
}

export function EventBudgetTab({ event }: EventBudgetTabProps) {
  const { items: initialItems, summary: initialSummary } = generateMockBudgetData(event)

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialItems)
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>(initialSummary)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [newBudgetItem, setNewBudgetItem] = useState<Partial<BudgetItem>>({
    name: "",
    category: "",
    amount: 0,
    type: "expense",
    status: "pending",
    notes: "",
  })

  // Filter budget items based on search query and active filter
  const filteredItems = budgetItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.vendor && item.vendor.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false

    if (activeFilter === "expenses") return item.type === "expense"
    if (activeFilter === "income") return item.type === "income"
    if (activeFilter === "paid") return item.status === "paid"
    if (activeFilter === "pending") return item.status === "pending"
    if (activeFilter === "overdue") return item.status === "overdue"

    return true
  })

  // Expenses and income
  const expenses = filteredItems.filter((item) => item.type === "expense")
  const income = filteredItems.filter((item) => item.type === "income")

  // Prepare data for charts
  const prepareExpensesByCategoryData = () => {
    const categoryTotals: Record<string, number> = {}

    expenses.forEach((item) => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0
      }
      categoryTotals[item.category] += item.amount
    })

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
  }

  const prepareMonthlyExpensesData = () => {
    const monthlyData: Record<string, number> = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    }

    expenses.forEach((item) => {
      const date = new Date(item.createdAt)
      const month = date.toLocaleString("default", { month: "short" })
      if (monthlyData[month] !== undefined) {
        monthlyData[month] += item.amount
      }
    })

    return Object.entries(monthlyData).map(([name, amount]) => ({ name, amount }))
  }

  const expensesByCategoryData = prepareExpensesByCategoryData()
  const monthlyExpensesData = prepareMonthlyExpensesData()

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
    "#A4DE6C",
    "#D0ED57",
    "#F56C6C",
  ]

  // Handle adding a new budget item
  const handleAddBudgetItem = () => {
    if (!newBudgetItem.name || !newBudgetItem.category || !newBudgetItem.amount) {
      return
    }

    const newItem: BudgetItem = {
      id: `item-${budgetItems.length + 1}`,
      name: newBudgetItem.name || "",
      category: newBudgetItem.category || "",
      amount: newBudgetItem.amount || 0,
      type: (newBudgetItem.type as "expense" | "income") || "expense",
      status: (newBudgetItem.status as "paid" | "pending" | "overdue") || "pending",
      dueDate: newBudgetItem.dueDate,
      notes: newBudgetItem.notes,
      vendor: newBudgetItem.vendor,
      paymentMethod: newBudgetItem.paymentMethod,
      createdAt: new Date().toISOString(),
    }

    // Add the new item
    const updatedItems = [...budgetItems, newItem]
    setBudgetItems(updatedItems)

    // Update summary
    const newSummary = { ...budgetSummary }
    if (newItem.type === "expense") {
      newSummary.totalExpenses += newItem.amount
      newSummary.remainingBudget -= newItem.amount

      // Check if this is now the largest expense category
      const categoryTotal = updatedItems
        .filter((item) => item.category === newItem.category && item.type === "expense")
        .reduce((sum, item) => sum + item.amount, 0)

      if (categoryTotal > newSummary.largestExpenseAmount) {
        newSummary.largestExpenseCategory = newItem.category
        newSummary.largestExpenseAmount = categoryTotal
      }

      if (
        newItem.status === "pending" &&
        newItem.dueDate &&
        new Date(newItem.dueDate) > new Date() &&
        new Date(newItem.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ) {
        newSummary.upcomingPayments++
      } else if (newItem.status === "overdue") {
        newSummary.overduePayments++
      }
    } else {
      newSummary.totalIncome += newItem.amount
      newSummary.remainingBudget += newItem.amount
    }

    setBudgetSummary(newSummary)

    // Reset form and close dialog
    setNewBudgetItem({
      name: "",
      category: "",
      amount: 0,
      type: "expense",
      status: "pending",
      notes: "",
    })
    setIsAddItemOpen(false)
  }

  // Handle deleting a budget item
  const handleDeleteBudgetItem = (itemId: string) => {
    const itemToDelete = budgetItems.find((item) => item.id === itemId)
    if (!itemToDelete) return

    // Remove the item
    const updatedItems = budgetItems.filter((item) => item.id !== itemId)
    setBudgetItems(updatedItems)

    // Update summary
    const newSummary = { ...budgetSummary }
    if (itemToDelete.type === "expense") {
      newSummary.totalExpenses -= itemToDelete.amount
      newSummary.remainingBudget += itemToDelete.amount

      // Recalculate largest expense category
      const categoryTotals: Record<string, number> = {}
      updatedItems
        .filter((item) => item.type === "expense")
        .forEach((item) => {
          if (!categoryTotals[item.category]) {
            categoryTotals[item.category] = 0
          }
          categoryTotals[item.category] += item.amount
        })

      let largestCategory = ""
      let largestAmount = 0

      Object.entries(categoryTotals).forEach(([category, amount]) => {
        if (amount > largestAmount) {
          largestCategory = category
          largestAmount = amount
        }
      })

      newSummary.largestExpenseCategory = largestCategory
      newSummary.largestExpenseAmount = largestAmount

      if (
        itemToDelete.status === "pending" &&
        itemToDelete.dueDate &&
        new Date(itemToDelete.dueDate) > new Date() &&
        new Date(itemToDelete.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ) {
        newSummary.upcomingPayments = Math.max(0, newSummary.upcomingPayments - 1)
      } else if (itemToDelete.status === "overdue") {
        newSummary.overduePayments = Math.max(0, newSummary.overduePayments - 1)
      }
    } else {
      newSummary.totalIncome -= itemToDelete.amount
      newSummary.remainingBudget -= itemToDelete.amount
    }

    setBudgetSummary(newSummary)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  // Add Budget Item Dialog
  const AddBudgetItemDialog = () => (
    <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Budget Item</DialogTitle>
          <DialogDescription>Add a new expense or income item to your event budget.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-type" className="text-right">
              Type
            </Label>
            <Select
              value={newBudgetItem.type}
              onValueChange={(value) => setNewBudgetItem({ ...newBudgetItem, type: value as "expense" | "income" })}
            >
              <SelectTrigger id="item-type" className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-name" className="text-right">
              Name
            </Label>
            <Input
              id="item-name"
              value={newBudgetItem.name}
              onChange={(e) => setNewBudgetItem({ ...newBudgetItem, name: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-category" className="text-right">
              Category
            </Label>
            <Input
              id="item-category"
              value={newBudgetItem.category}
              onChange={(e) => setNewBudgetItem({ ...newBudgetItem, category: e.target.value })}
              className="col-span-3"
              placeholder={newBudgetItem.type === "expense" ? "e.g., Venue, Catering" : "e.g., Sponsorship, Tickets"}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="mr-2">$</span>
              <Input
                id="item-amount"
                type="number"
                value={newBudgetItem.amount?.toString() || ""}
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, amount: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-status" className="text-right">
              Status
            </Label>
            <Select
              value={newBudgetItem.status}
              onValueChange={(value) =>
                setNewBudgetItem({ ...newBudgetItem, status: value as "paid" | "pending" | "overdue" })
              }
            >
              <SelectTrigger id="item-status" className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-due-date" className="text-right">
              Due Date
            </Label>
            <Input
              id="item-due-date"
              type="date"
              value={newBudgetItem.dueDate ? new Date(newBudgetItem.dueDate).toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setNewBudgetItem({
                  ...newBudgetItem,
                  dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                })
              }
              className="col-span-3"
            />
          </div>

          {newBudgetItem.type === "expense" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-vendor" className="text-right">
                Vendor
              </Label>
              <Input
                id="item-vendor"
                value={newBudgetItem.vendor || ""}
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, vendor: e.target.value })}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-payment-method" className="text-right">
              Payment Method
            </Label>
            <Input
              id="item-payment-method"
              value={newBudgetItem.paymentMethod || ""}
              onChange={(e) => setNewBudgetItem({ ...newBudgetItem, paymentMethod: e.target.value })}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="item-notes" className="text-right pt-2">
              Notes
            </Label>
            <Textarea
              id="item-notes"
              value={newBudgetItem.notes || ""}
              onChange={(e) => setNewBudgetItem({ ...newBudgetItem, notes: e.target.value })}
              className="col-span-3"
              placeholder="Optional"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddBudgetItem}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Add budget item dialog */}
      <AddBudgetItemDialog />

      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Budget Management</h2>
          <p className="text-muted-foreground">Track expenses and income for your event</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-1">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button className="gap-1" onClick={() => setIsAddItemOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Budget summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(budgetSummary.totalBudget)}</div>
            <div className="mt-1">
              <Progress value={(budgetSummary.totalExpenses / budgetSummary.totalBudget) * 100} className="h-2" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round((budgetSummary.totalExpenses / budgetSummary.totalBudget) * 100)}% used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(budgetSummary.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              Largest category: {budgetSummary.largestExpenseCategory} (
              {formatCurrency(budgetSummary.largestExpenseAmount)})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(budgetSummary.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Additional funds beyond initial budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${budgetSummary.remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(budgetSummary.remainingBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              {budgetSummary.upcomingPayments} upcoming, {budgetSummary.overduePayments} overdue payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget visualization */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expensesByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Spending trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExpensesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="var(--color-amount)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget items table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Budget Items</CardTitle>
              <CardDescription>All expenses and income for your event</CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={activeFilter || "all"}
                onValueChange={(value) => setActiveFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="expenses">Expenses Only</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="paid">Paid Items</SelectItem>
                  <SelectItem value="pending">Pending Items</SelectItem>
                  <SelectItem value="overdue">Overdue Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-0">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>

            <ScrollArea className="max-h-[500px]">
              <TabsContent value="all" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No budget items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className={item.type === "expense" ? "text-red-600" : "text-green-600"}>
                            {item.type === "expense" ? "-" : "+"}
                            {formatCurrency(item.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={item.type === "expense" ? "destructive" : "default"}
                              className={item.type === "income" ? "bg-green-500" : ""}
                            >
                              {item.type === "expense" ? (
                                <ArrowUp className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="mr-1 h-3 w-3" />
                              )}
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "paid"
                                  ? "default"
                                  : item.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={item.status === "paid" ? "bg-green-500" : ""}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(item.dueDate)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteBudgetItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No expenses found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-red-600">-{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{item.vendor || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "paid"
                                  ? "default"
                                  : item.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={item.status === "paid" ? "bg-green-500" : ""}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(item.dueDate)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteBudgetItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {income.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No income items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      income.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-green-600">+{formatCurrency(item.amount)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "paid"
                                  ? "default"
                                  : item.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={item.status === "paid" ? "bg-green-500" : ""}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.paymentMethod || "N/A"}</TableCell>
                          <TableCell>{formatDate(item.dueDate)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteBudgetItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {budgetItems.length} budget items
          </div>
          <Button variant="outline" className="gap-1" onClick={() => setIsAddItemOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

