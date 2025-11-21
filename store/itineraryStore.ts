'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Itinerary, TripPreferences, Place } from '@/types'

interface OnboardingPreferences {
  style: string | null
  interests: string[]
  budget: string | null
  adults: number
  children: number
  childAgeGroups: string[] | null
  groupType: string | null
  city: string | null
}

interface SavedItinerary {
  id: string
  savedAt: string
  itinerary: Itinerary
}

interface ItineraryState {
  itinerary: Itinerary | null
  preferences: TripPreferences | null
  onboardingCompleted: boolean
  showOnboarding: boolean
  onboardingPreferences: OnboardingPreferences | null
  favoritePlaces: Place[]
  savedItineraries: SavedItinerary[]
  setPreferences: (preferences: TripPreferences) => void
  setItinerary: (itinerary: Itinerary) => void
  updateItinerary: (itinerary: Itinerary) => void
  clearItinerary: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  setOnboardingPreferences: (preferences: OnboardingPreferences) => void
  addFavoritePlace: (place: Place) => void
  removeFavoritePlace: (placeId: string) => void
  isFavoritePlace: (placeId: string) => boolean
  saveItinerary: (itinerary: Itinerary) => string
  loadSavedItinerary: (id: string) => Itinerary | null
  deleteSavedItinerary: (id: string) => void
}

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      itinerary: null,
      preferences: null,
      onboardingCompleted: false,
      showOnboarding: false,
      onboardingPreferences: null,
      favoritePlaces: [],
      savedItineraries: [],
      setPreferences: (preferences) => set({ preferences }),
      setItinerary: (itinerary) => set({ itinerary }),
      updateItinerary: (itinerary) => set({ itinerary }),
      clearItinerary: () => set({ itinerary: null, preferences: null }),
      completeOnboarding: () => set({ onboardingCompleted: true, showOnboarding: false }),
      resetOnboarding: () => set({ onboardingCompleted: false, showOnboarding: true }),
      setOnboardingPreferences: (preferences) => set({ onboardingPreferences: preferences }),
      addFavoritePlace: (place) => {
        const { favoritePlaces } = get()
        if (!favoritePlaces.find((p) => p.id === place.id)) {
          set({ favoritePlaces: [...favoritePlaces, place] })
        }
      },
      removeFavoritePlace: (placeId) => {
        const { favoritePlaces } = get()
        set({ favoritePlaces: favoritePlaces.filter((p) => p.id !== placeId) })
      },
      isFavoritePlace: (placeId) => {
        const { favoritePlaces } = get()
        return favoritePlaces.some((p) => p.id === placeId)
      },
      saveItinerary: (itinerary) => {
        const { savedItineraries } = get()
        const id = `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const savedItinerary: SavedItinerary = {
          id,
          savedAt: new Date().toISOString(),
          itinerary,
        }
        set({ savedItineraries: [savedItinerary, ...savedItineraries] })
        return id
      },
      loadSavedItinerary: (id) => {
        const { savedItineraries } = get()
        const saved = savedItineraries.find((si) => si.id === id)
        if (saved) {
          set({ itinerary: saved.itinerary, preferences: saved.itinerary.preferences })
          return saved.itinerary
        }
        return null
      },
      deleteSavedItinerary: (id) => {
        const { savedItineraries } = get()
        set({ savedItineraries: savedItineraries.filter((si) => si.id !== id) })
      },
    }),
    {
      name: 'itinerary-storage',
    }
  )
)

