'use client'

import { useParams, useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { mockPlaces, getPlacesByCity, getPopularJapanSpots } from '@/lib/mockData'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BackButton } from '@/components/BackButton'
import type { PlaceCategory } from '@/types'

export default function PlaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { itinerary, updateItinerary, onboardingPreferences, favoritePlaces, addFavoritePlace, removeFavoritePlace, isFavoritePlace } = useItineraryStore()
  const placeId = params.placeId as string
  const isFavorite = isFavoritePlace(placeId)
  
  // 일정에 포함된 스팟인지 확인
  const isInItinerary = itinerary?.days.some((day) =>
    day.slots.some((slot) => slot.placeId === placeId)
  ) ?? false
  
  // 모든 장소 목록에서 찾기 (itinerary가 없어도 작동)
  let allPlaces: typeof mockPlaces.tokyo = []
  if (itinerary) {
    allPlaces = getPlacesByCity(itinerary.city)
  } else if (onboardingPreferences?.city) {
    allPlaces = getPlacesByCity(onboardingPreferences.city)
  } else {
    // itinerary도 없고 선호 도시도 없으면 모든 유명 스팟에서 찾기
    allPlaces = getPopularJapanSpots()
  }
  
  // 모든 도시의 장소를 합쳐서 찾기
  const allCitiesPlaces = [
    ...mockPlaces.tokyo,
    ...mockPlaces.osaka,
    ...mockPlaces.kyoto,
    ...mockPlaces.fukuoka,
    ...mockPlaces.hokkaido,
    ...mockPlaces.okinawa,
  ]
  
  const place = allCitiesPlaces.find((p) => p.id === placeId)
  
  if (!place) {
    router.push('/')
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
  
  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavoritePlace(placeId)
    } else {
      addFavoritePlace(place)
    }
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <BackButton href={itinerary ? "/plan" : "/"} label={itinerary ? "일정 보기로" : "홈으로"} />
        <Breadcrumb
          items={[
            ...(itinerary ? [{ label: '일정 보기', href: '/plan' }] : []),
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
          <div className="border border-gray-300 p-4 md:p-5 rounded-[16px]">
            <h2 className="font-semibold text-base md:text-lg mb-2 md:mb-3">위치</h2>
            <p className="text-sm md:text-base text-gray-700">{place.area} 지역</p>
          </div>
          
          <div className="border border-gray-300 p-4 md:p-5 rounded-[16px]">
            <h2 className="font-semibold text-base md:text-lg mb-2 md:mb-3">설명</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">{place.description}</p>
          </div>
          
          <div className="border border-gray-300 p-4 md:p-5 rounded-[16px]">
            <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4">추천 이유</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              이 장소는 {categoryLabels[place.category]} 카테고리에 속하며, {place.area} 지역의 대표적인 관광지입니다.
              {itinerary ? ' 여행 스타일에 맞춰 일정에 포함되었습니다.' : ' 일본 여행에서 꼭 방문해볼 만한 곳입니다.'}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-300">
            <button
              onClick={handleToggleFavorite}
              className={`flex-1 border px-4 py-3 md:py-2 text-sm md:text-sm transition-colors touch-manipulation ${
                isFavorite
                  ? 'bg-black text-white border-black hover:bg-gray-800 active:bg-gray-900'
                  : 'border-gray-400 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              {isFavorite ? '관심 스팟에서 제거' : '관심 스팟에 저장'}
            </button>
            
            {isInItinerary && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

