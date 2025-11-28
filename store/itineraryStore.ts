'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Itinerary, TripPreferences, Place } from '@/types'
import type { CharacterType } from '@/lib/travelCharacter'

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
  title: string
  savedAt: string
  itinerary: Itinerary
}

interface ItineraryState {
  itinerary: Itinerary | null
  preferences: TripPreferences | null
  onboardingCompleted: boolean
  showOnboarding: boolean
  onboardingPreferences: OnboardingPreferences | null
  onboardingCharacter: CharacterType | null
  favoritePlaces: Place[]
  savedItineraries: SavedItinerary[]
  setPreferences: (preferences: TripPreferences) => void
  setItinerary: (itinerary: Itinerary) => void
  updateItinerary: (itinerary: Itinerary) => void
  clearItinerary: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  setOnboardingPreferences: (preferences: OnboardingPreferences) => void
  setOnboardingCharacter: (character: CharacterType | null) => void
  addFavoritePlace: (place: Place) => void
  removeFavoritePlace: (placeId: string) => void
  isFavoritePlace: (placeId: string) => boolean
  saveItinerary: (itinerary: Itinerary, title?: string) => string
  loadSavedItinerary: (id: string) => Itinerary | null
  deleteSavedItinerary: (id: string) => void
  updateSavedItineraryTitle: (id: string, title: string) => void
  updateSavedItinerary: (id: string, itinerary: Itinerary, title?: string) => void
}

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      itinerary: null,
      preferences: null,
      onboardingCompleted: false,
      showOnboarding: false,
      onboardingPreferences: null,
      onboardingCharacter: null,
      favoritePlaces: [],
      savedItineraries: [],
      setPreferences: (preferences) => set({ preferences }),
      setItinerary: (itinerary) => set({ itinerary }),
      updateItinerary: (itinerary) => set({ itinerary }),
      clearItinerary: () => set({ itinerary: null, preferences: null }),
      completeOnboarding: () => set({ onboardingCompleted: true, showOnboarding: false }),
      resetOnboarding: () => set({ onboardingCompleted: false, showOnboarding: true, onboardingCharacter: null }),
      setOnboardingPreferences: (preferences) => set({ onboardingPreferences: preferences }),
      setOnboardingCharacter: (character) => set({ onboardingCharacter: character }),
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
      saveItinerary: (itinerary, title) => {
        const { savedItineraries } = get()
        const id = `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const savedItinerary: SavedItinerary = {
          id,
          title: title || `${itinerary.city} 여행`,
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
      updateSavedItineraryTitle: (id, title) => {
        const { savedItineraries } = get()
        set({
          savedItineraries: savedItineraries.map((si) =>
            si.id === id ? { ...si, title: title.trim() || `${si.itinerary.city} 여행` } : si
          ),
        })
      },
      updateSavedItinerary: (id, itinerary, title) => {
        const { savedItineraries } = get()
        set({
          savedItineraries: savedItineraries.map((si) =>
            si.id === id
              ? {
                  ...si,
                  itinerary,
                  title: title?.trim() || si.title || `${itinerary.city} 여행`,
                }
              : si
          ),
        })
      },
    }),
    {
      name: 'itinerary-storage',
    }
  )
)

