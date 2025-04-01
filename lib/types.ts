export interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  location: string
  attendees: number
  coverImage?: string
  organizer: string
  type?: string
  budget?: number
}


export interface Vendor {
  id: string
  name: string
  category: string
  description: string
  priceRange: string
  rating: number
  reviewCount: number
  image?: string
  location: {
    address: string
    city: string
    state: string
    zip: string
  }
  contact: {
    phone: string
    email: string
    website: string
  }
  specialties?: string[]
  isFavorite?: boolean
}
