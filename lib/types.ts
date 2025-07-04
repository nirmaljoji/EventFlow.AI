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
  sustainable?: boolean
}

// Remove duplicate License type since it's defined as an interface below
// export type FoodList = {
//   items: Food[];
// };




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

export interface License {
  id: string
  name: string
  type: string
  description: string
  status: "approved" | "pending" | "missing" | "rejected"
  dueDate: string
  issuingAuthority: string
  applicationDate?: string
  approvalDate?: string
  rejectionReason?: string
  cost: number
  icon: React.ElementType
  documents: string[]
  notes?: string
}
