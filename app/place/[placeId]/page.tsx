'use client'

import { useParams, useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { mockPlaces, getPlacesByCity } from '@/lib/mockData'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BackButton } from '@/components/BackButton'
import type { PlaceCategory } from '@/types'

export default function PlaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { itinerary, updateItinerary } = useItineraryStore()
  const placeId = params.placeId as string
  
  if (!itinerary) {
    router.push('/plan')
    return null
  }
  
  const allPlaces = getPlacesByCity(itinerary.city)
  const place = allPlaces.find((p) => p.id === placeId)
  
  if (!place) {
    router.push('/plan')
    return null
  }
  
  const categoryLabels: Record<PlaceCategory, string> = {
    cafe: '카페',
    restaurant: '레스토랑',
    shopping: '쇼핑',
    museum: '박물관/사원',
    themePark: '테마파크',
    nature: '자연/공원',
    other: '기타',
  }
  
  const handleRemoveFromItinerary = () => {
    if (!itinerary) return
    
    const newDays = itinerary.days.map((day) => ({
      ...day,
      slots: day.slots.filter((slot) => slot.placeId !== placeId),
    }))
    
    updateItinerary({ ...itinerary, days: newDays })
    router.push('/plan')
  }
  
  const handleSwapWithSimilar = () => {
    if (!itinerary) return
    
    const similarPlaces = allPlaces.filter(
      (p) => p.id !== placeId && (p.category === place.category || p.area === place.area)
    )
    
    if (similarPlaces.length === 0) {
      alert('유사한 장소를 찾을 수 없습니다.')
      return
    }
    
    const randomPlace = similarPlaces[Math.floor(Math.random() * similarPlaces.length)]
    
    const newDays = itinerary.days.map((day) => ({
      ...day,
      slots: day.slots.map((slot) =>
        slot.placeId === placeId ? { ...slot, placeId: randomPlace.id } : slot
      ),
    }))
    
    updateItinerary({ ...itinerary, days: newDays })
    router.push(`/place/${randomPlace.id}`)
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <BackButton href="/plan" label="일정 보기로" />
        <Breadcrumb
          items={[
            { label: '일정 보기', href: '/plan' },
            { label: place.name },
          ]}
        />
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">{place.name}</h1>
          <p className="text-sm md:text-base text-gray-600">
            {categoryLabels[place.category]} · {place.area}
          </p>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          <div className="border border-gray-300 p-4 md:p-5">
            <h2 className="font-semibold text-base md:text-lg mb-2 md:mb-3">위치</h2>
            <p className="text-sm md:text-base text-gray-700">{place.area} 지역</p>
          </div>
          
          <div className="border border-gray-300 p-4 md:p-5">
            <h2 className="font-semibold text-base md:text-lg mb-2 md:mb-3">설명</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">{place.description}</p>
          </div>
          
          <div className="border border-gray-300 p-4 md:p-5">
            <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4">추천 이유</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              이 장소는 {categoryLabels[place.category]} 카테고리에 속하며, {place.area} 지역의 대표적인 관광지입니다.
              여행 스타일에 맞춰 일정에 포함되었습니다.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-300">
            <button
              onClick={handleRemoveFromItinerary}
              className="flex-1 border border-gray-400 px-4 py-3 md:py-2 text-sm md:text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            >
              일정에서 제거
            </button>
            <button
              onClick={handleSwapWithSimilar}
              className="flex-1 border border-gray-400 px-4 py-3 md:py-2 text-sm md:text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            >
              유사한 장소로 교체
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

