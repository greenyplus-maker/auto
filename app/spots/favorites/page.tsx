'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { BackButton } from '@/components/BackButton'
import type { PlaceCategory, Place } from '@/types'

const cities = ['전체', '도쿄', '오사카', '교토', '후쿠오카', '홋카이도', '오키나와', '다카마쓰', '기타']

// 도시별 area 매핑
const cityAreaMap: Record<string, string[]> = {
  '도쿄': ['시부야', '하라주쿠', '아사쿠사', '다이칸야마', '오모테산도', '우에노', '나카메구로', '긴자', '스미다', '우라야스', '도쿄'],
  '오사카': ['오사카', '난바', '우메다', '신사이바시', '도톤보리'],
  '교토': ['후시미', '히가시야마', '아라시야마', '기타', '기온'],
  '후쿠오카': ['하카타', '주오', '모모치'],
  '홋카이도': ['삿포로', '오타루', '후라노', '노보리베츠', '아사히카와'],
  '오키나와': ['나하', '모토부', '나고', '쵸탄'],
  '다카마쓰': ['다카마쓰', '야시마', '오타루시마'],
}

function getCityByArea(area: string): string {
  for (const [city, areas] of Object.entries(cityAreaMap)) {
    if (areas.some(a => area.includes(a) || a.includes(area))) {
      return city
    }
  }
  return '기타'
}

export default function FavoriteSpotsPage() {
  const router = useRouter()
  const { favoritePlaces, removeFavoritePlace } = useItineraryStore()
  const [selectedCity, setSelectedCity] = useState<string>('전체')
  
  const categoryLabels: Record<PlaceCategory, string> = {
    cafe: '카페',
    restaurant: '레스토랑',
    shopping: '쇼핑',
    museum: '박물관/사원',
    themePark: '테마파크',
    nature: '자연/공원',
    other: '기타',
  }
  
  // 지역별로 필터링된 관심 스팟
  const filteredPlaces = useMemo(() => {
    if (selectedCity === '전체') {
      return favoritePlaces
    }
    return favoritePlaces.filter((place) => {
      const placeCity = getCityByArea(place.area)
      return placeCity === selectedCity
    })
  }, [favoritePlaces, selectedCity])
  
  // 각 도시별 스팟 개수
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = { 전체: favoritePlaces.length }
    favoritePlaces.forEach((place) => {
      const city = getCityByArea(place.area)
      counts[city] = (counts[city] || 0) + 1
    })
    return counts
  }, [favoritePlaces])
  
  const handlePlaceClick = (placeId: string) => {
    router.push(`/place/${placeId}`)
  }
  
  const handleRemoveFavorite = (e: React.MouseEvent, placeId: string) => {
    e.stopPropagation()
    removeFavoritePlace(placeId)
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <BackButton href="/" label="홈으로" />
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">관심 스팟</h1>
          <p className="text-sm md:text-base text-gray-600">
            저장한 관광 스팟을 확인하세요.
          </p>
        </div>
        
        {favoritePlaces.length === 0 ? (
          <div className="border border-gray-300 p-8 md:p-12 text-center rounded-[16px]">
            <p className="text-base md:text-lg text-gray-600 mb-4">저장된 관심 스팟이 없습니다.</p>
            <p className="text-sm md:text-base text-gray-500">
              스팟 상세 페이지에서 관심 스팟에 저장할 수 있습니다.
            </p>
          </div>
        ) : (
          <>
            {/* 지역별 탭 */}
            <div className="mb-6 md:mb-8">
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {cities.map((city) => {
                  const count = cityCounts[city] || 0
                  if (city !== '전체' && count === 0) return null
                  
                  return (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap transition-colors touch-manipulation rounded-[8px] ${
                        selectedCity === city
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city} {city !== '전체' && `(${count})`}
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* 필터링된 스팟 목록 */}
            {filteredPlaces.length === 0 ? (
              <div className="border border-gray-300 p-8 md:p-12 text-center rounded-[16px]">
                <p className="text-base md:text-lg text-gray-600">
                  {selectedCity} 지역에 저장된 관심 스팟이 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="border border-gray-300 p-4 md:p-5 hover:border-black transition-colors cursor-pointer rounded-[16px]"
                    onClick={() => handlePlaceClick(place.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h2 className="text-base md:text-lg font-semibold mb-1">{place.name}</h2>
                        <p className="text-xs md:text-sm text-gray-500 mb-2">
                          {categoryLabels[place.category]} · {place.area}
                        </p>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-2">
                          {place.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleRemoveFavorite(e, place.id)}
                        className="ml-4 px-3 py-2 text-sm border border-gray-400 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation rounded-[8px]"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}


