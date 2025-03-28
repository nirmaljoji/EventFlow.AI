import type { Event } from "./types"

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Annual Tech Conference",
    description: "Our flagship technology conference with industry leaders",
    startDate: "2025-03-15T09:00:00Z",
    endDate: "2025-03-17T18:00:00Z",
    location: "San Francisco, CA",
    attendees: 10,
    coverImage: "/placeholder.svg?height=128&width=384&text=Tech+Conference",
    organizer: "EventFlow.AI",
    type: "Conference",
  },
  {
    id: "2",
    title: "Product Launch Event",
    description: "Launching our new AI-powered platform",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
    location: "Virtual Event",
    attendees: 500,
    coverImage: "/placeholder.svg?height=128&width=384&text=Product+Launch",
    organizer: "EvenFlow.AI",
    type: "Launch",
  },
  {
    id: "3",
    title: "Leadership Summit",
    description: "Exclusive gathering for C-level executives",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 2 weeks + 1 day from now
    location: "New York, NY",
    attendees: 75,
    coverImage: "/placeholder.svg?height=128&width=384&text=Leadership+Summit",
    organizer: "EvenFlow.AI",
    type: "Summit",
  },
  {
    id: "4",
    title: "Developer Workshop",
    description: "Hands-on workshop for developers to learn new technologies",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29).toISOString(), // 29 days ago
    location: "Online",
    attendees: 250,
    coverImage: "/placeholder.svg?height=128&width=384&text=Dev+Workshop",
    organizer: "EvenFlow.AI",
    type: "Workshop",
  },
  {
    id: "5",
    title: "Marketing Masterclass",
    description: "Learn advanced marketing strategies for your business",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 3).toISOString(), // 1 week + 3 hours from now
    location: "Chicago, IL",
    attendees: 120,
    coverImage: "/placeholder.svg?height=128&width=384&text=Marketing+Masterclass",
    organizer: "EvenFlow.AI",
    type: "Masterclass",
  },
  {
    id: "6",
    title: "Customer Experience Forum",
    description: "Discussing best practices in customer experience",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 58).toISOString(), // 58 days ago
    location: "Miami, FL",
    attendees: 300,
    coverImage: "/placeholder.svg?height=128&width=384&text=CX+Forum",
    organizer: "EvenFlow.AI",
    type: "Forum",
  },
  {
    id: "7",
    title: "AI Innovation Summit",
    description: "Exploring the future of artificial intelligence",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day from now
    location: "Boston, MA",
    attendees: 450,
    coverImage: "/placeholder.svg?height=128&width=384&text=AI+Summit",
    organizer: "EvenFlow.AI",
    type: "Summit",
  },
  {
    id: "8",
    title: "Networking Mixer",
    description: "Connect with industry professionals in a casual setting",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(), // 3 weeks from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21 + 1000 * 60 * 60 * 4).toISOString(), // 3 weeks + 4 hours from now
    location: "Seattle, WA",
    attendees: 150,
    coverImage: "/placeholder.svg?height=128&width=384&text=Networking+Mixer",
    organizer: "EvenFlow.AI",
    type: "Networking",
  },
  {
    id: "9",
    title: "Annual Charity Gala",
    description: "Fundraising event for local community initiatives",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45 + 1000 * 60 * 60 * 5).toISOString(), // 45 days + 5 hours from now
    location: "Los Angeles, CA",
    attendees: 350,
    coverImage: "/placeholder.svg?height=128&width=384&text=Charity+Gala",
    organizer: "EvenFlow.AI",
    type: "Gala",
  },
  {
    id: "10",
    title: "Industry Trade Show",
    description: "Showcase of the latest products and services in the industry",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 63).toISOString(), // 63 days from now
    location: "Las Vegas, NV",
    attendees: 2000,
    coverImage: "/placeholder.svg?height=128&width=384&text=Trade+Show",
    organizer: "EvenFlow.AI",
    type: "Trade Show",
  },
  {
    id: "11",
    title: "Product Training Seminar",
    description: "In-depth training on our latest product offerings",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 11).toISOString(), //   // 10 days from now
    location: "Denver, CO",
    attendees: 80,
    coverImage: "/placeholder.svg?height=128&width=384&text=Training+Seminar",
    organizer: "EvenFlow.AI",
    type: "Training",
  },
  {
    id: "12",
    title: "Startup Pitch Competition",
    description: "Emerging startups compete for funding and recognition",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 8).toISOString(), // 30 days + 8 hours from now
    location: "Austin, TX",
    attendees: 200,
    coverImage: "/placeholder.svg?height=128&width=384&text=Pitch+Competition",
    organizer: "EvenFlow.AI",
    type: "Competition",
  },
]

