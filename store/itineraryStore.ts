'use client'

import { create } from 'zustand'
import type { Itinerary, TripPreferences } from '@/types'

interface ItineraryState {
  itinerary: Itinerary | null
  preferences: TripPreferences | null
  setPreferences: (preferences: TripPreferences) => void
  setItinerary: (itinerary: Itinerary) => void
  updateItinerary: (itinerary: Itinerary) => void
  clearItinerary: () => void
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  itinerary: null,
  preferences: null,
  setPreferences: (preferences) => set({ preferences }),
  setItinerary: (itinerary) => set({ itinerary }),
  updateItinerary: (itinerary) => set({ itinerary }),
  clearItinerary: () => set({ itinerary: null, preferences: null }),
}))

