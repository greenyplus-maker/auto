export type ChildAgeGroup = "under6" | "6to12" | "13plus"
export type TravelStyle = "relaxed" | "normal" | "intensive"
export type Budget = "low" | "medium" | "high"
export type PlaceCategory = "cafe" | "restaurant" | "shopping" | "museum" | "themePark" | "nature" | "other"
export type TimeSlotLabel = "Morning" | "Lunch" | "Afternoon" | "Dinner" | "Evening"

export interface TripPreferences {
  city: string
  startDate: string
  endDate: string
  adults: number
  children: number
  childAgeGroup: ChildAgeGroup
  style: TravelStyle
  interests: string[]
  budget: Budget
}

export interface Place {
  id: string
  name: string
  category: PlaceCategory
  area: string
  description: string
}

export interface TimeSlot {
  id: string
  label: TimeSlotLabel | string
  placeId: string
}

export interface DayPlan {
  index: number
  summary: string
  slots: TimeSlot[]
}

export interface Itinerary {
  city: string
  startDate: string
  endDate: string
  preferences: TripPreferences
  days: DayPlan[]
}

