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

interface ItineraryState {
  itinerary: Itinerary | null
  preferences: TripPreferences | null
  onboardingCompleted: boolean
  showOnboarding: boolean
  onboardingPreferences: OnboardingPreferences | null
  favoritePlaces: Place[]
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
    }),
    {
      name: 'itinerary-storage',
    }
  )
)

