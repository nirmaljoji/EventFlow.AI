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
}

