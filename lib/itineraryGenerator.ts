import type { Itinerary, TripPreferences, DayPlan, TimeSlot, Place } from '@/types'
import { getPlacesByCity, getPlacesByInterests } from './mockData'

const timeSlotLabels: Array<TimeSlot['label']> = ['Morning', 'Lunch', 'Afternoon', 'Dinner', 'Evening']

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

function getSlotsPerDay(style: TripPreferences['style']): number {
  switch (style) {
    case 'relaxed':
      return 3
    case 'normal':
      return 4
    case 'intensive':
      return 5
    default:
      return 4
  }
}

function generateDaySummary(city: string, dayIndex: number, places: Place[]): string {
  const areas = [...new Set(places.map((p) => p.area))]
  const mainArea = areas[0] || city
  const secondaryArea = areas[1] || ''
  
  if (secondaryArea) {
    return `${mainArea} – ${secondaryArea} 관광 및 탐방`
  }
  return `${mainArea} 지역 탐방`
}

export function generateItinerary(preferences: TripPreferences): Itinerary {
  const daysCount = calculateDays(preferences.startDate, preferences.endDate)
  const slotsPerDay = getSlotsPerDay(preferences.style)
  
  const allPlaces = getPlacesByCity(preferences.city)
  const filteredPlaces = getPlacesByInterests(allPlaces, preferences.interests)
  
  // 충분한 장소가 없으면 모든 장소 사용
  const availablePlaces = filteredPlaces.length >= slotsPerDay * daysCount 
    ? filteredPlaces 
    : allPlaces
  
  const days: DayPlan[] = []
  const usedPlaceIds = new Set<string>()
  let availableIndex = 0
  
  for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
    const dayPlaces: Place[] = []
    const slots: TimeSlot[] = []
    
    for (let slotIndex = 0; slotIndex < slotsPerDay; slotIndex++) {
      // 사용되지 않은 장소 찾기
      let place: Place | null = null
      let attempts = 0
      const maxAttempts = availablePlaces.length
      
      // 먼저 사용되지 않은 장소를 찾음
      while (attempts < maxAttempts && !place) {
        const candidate = availablePlaces[availableIndex % availablePlaces.length]
        if (!usedPlaceIds.has(candidate.id)) {
          place = candidate
          usedPlaceIds.add(candidate.id)
        }
        availableIndex++
        attempts++
      }
      
      // 사용 가능한 장소가 없으면 모든 장소에서 선택 (중복 허용)
      if (!place) {
        place = availablePlaces[availableIndex % availablePlaces.length]
        availableIndex++
      }
      
      dayPlaces.push(place)
      
      const label = timeSlotLabels[slotIndex % timeSlotLabels.length]
      slots.push({
        id: `day-${dayIndex}-slot-${slotIndex}`,
        label,
        placeId: place.id,
      })
    }
    
    const summary = generateDaySummary(preferences.city, dayIndex, dayPlaces)
    
    days.push({
      index: dayIndex,
      summary,
      slots,
    })
  }
  
  return {
    city: preferences.city,
    startDate: preferences.startDate,
    endDate: preferences.endDate,
    preferences,
    days,
  }
}

