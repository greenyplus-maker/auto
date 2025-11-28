'use client'

import { useParams, useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { mockPlaces, getPlacesByCity } from '@/lib/mockData'
import { BackButton } from '@/components/BackButton'
import type { TimeSlot } from '@/types'

export default function DayDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { itinerary, updateItinerary } = useItineraryStore()
  const dayIndex = parseInt(params.dayIndex as string)
  
  if (!itinerary || isNaN(dayIndex) || dayIndex < 0 || dayIndex >= itinerary.days.length) {
    router.push('/plan')
    return null
  }
  
  const day = itinerary.days[dayIndex]
  const allPlaces = getPlacesByCity(itinerary.city)
  const placeMap = new Map(allPlaces.map((p) => [p.id, p]))
  
  const handleMoveUp = (slotIndex: number) => {
    if (slotIndex === 0) return
    
    const newDays = [...itinerary.days]
    const currentDay = { ...newDays[dayIndex] }
    const slots = [...currentDay.slots]
    ;[slots[slotIndex - 1], slots[slotIndex]] = [slots[slotIndex], slots[slotIndex - 1]]
    currentDay.slots = slots
    newDays[dayIndex] = currentDay
    
    updateItinerary({ ...itinerary, days: newDays })
  }
  
  const handleMoveDown = (slotIndex: number) => {
    if (slotIndex === itinerary.days[dayIndex].slots.length - 1) return
    
    const newDays = [...itinerary.days]
    const currentDay = { ...newDays[dayIndex] }
    const slots = [...currentDay.slots]
    ;[slots[slotIndex], slots[slotIndex + 1]] = [slots[slotIndex + 1], slots[slotIndex]]
    currentDay.slots = slots
    newDays[dayIndex] = currentDay
    
    updateItinerary({ ...itinerary, days: newDays })
  }
  
  const handleRemove = (slotIndex: number) => {
    const newDays = [...itinerary.days]
    const currentDay = { ...newDays[dayIndex] }
    currentDay.slots = currentDay.slots.filter((_, i) => i !== slotIndex)
    newDays[dayIndex] = currentDay
    
    updateItinerary({ ...itinerary, days: newDays })
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <BackButton href="/plan" label="일정 보기로" />
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">Day {dayIndex + 1}</h1>
          <p className="text-sm md:text-base text-gray-600">{day.summary}</p>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          {day.slots.map((slot, slotIndex) => {
            const place = placeMap.get(slot.placeId)
            if (!place) return null
            
            return (
              <div key={slot.id} className="border border-gray-300 p-4 md:p-5 rounded-[16px]">
                <div className="flex items-start justify-between mb-3 md:mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{slot.label}</h3>
                    <h4 className="font-medium text-base md:text-base mb-1 md:mb-2">{place.name}</h4>
                    <p className="text-sm md:text-sm text-gray-600 mb-2 md:mb-1 leading-relaxed">{place.description}</p>
                    <p className="text-xs md:text-xs text-gray-500">지역: {place.area}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 md:gap-2 mt-4 flex-wrap">
                  {slotIndex > 0 && (
                    <button
                      onClick={() => handleMoveUp(slotIndex)}
                      className="border border-gray-400 px-4 py-2 md:px-3 md:py-1 text-sm md:text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                    >
                      위로
                    </button>
                  )}
                  {slotIndex < day.slots.length - 1 && (
                    <button
                      onClick={() => handleMoveDown(slotIndex)}
                      className="border border-gray-400 px-4 py-2 md:px-3 md:py-1 text-sm md:text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                    >
                      아래로
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(slotIndex)}
                    className="border border-gray-400 px-4 py-2 md:px-3 md:py-1 text-sm md:text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                  >
                    제거
                  </button>
                  <button
                    onClick={() => router.push(`/place/${place.id}`)}
                    className="border border-gray-400 px-4 py-2 md:px-3 md:py-1 text-sm md:text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

