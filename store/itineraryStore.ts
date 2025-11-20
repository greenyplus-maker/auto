'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Itinerary, TripPreferences } from '@/types'

interface OnboardingPreferences {
  style: string | null
  interests: string[]
  budget: string | null
  adults: number
  children: number
  childAgeGroup: string | null
  city: string | null
}

interface ItineraryState {
  itinerary: Itinerary | null
  preferences: TripPreferences | null
  onboardingCompleted: boolean
  showOnboarding: boolean
  onboardingPreferences: OnboardingPreferences | null
  setPreferences: (preferences: TripPreferences) => void
  setItinerary: (itinerary: Itinerary) => void
  updateItinerary: (itinerary: Itinerary) => void
  clearItinerary: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  setOnboardingPreferences: (preferences: OnboardingPreferences) => void
}

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set) => ({
      itinerary: null,
      preferences: null,
      onboardingCompleted: false,
      showOnboarding: false,
      onboardingPreferences: null,
      setPreferences: (preferences) => set({ preferences }),
      setItinerary: (itinerary) => set({ itinerary }),
      updateItinerary: (itinerary) => set({ itinerary }),
      clearItinerary: () => set({ itinerary: null, preferences: null }),
      completeOnboarding: () => set({ onboardingCompleted: true, showOnboarding: false }),
      resetOnboarding: () => set({ onboardingCompleted: false, showOnboarding: true }),
      setOnboardingPreferences: (preferences) => set({ onboardingPreferences: preferences }),
    }),
    {
      name: 'itinerary-storage',
    }
  )
)

