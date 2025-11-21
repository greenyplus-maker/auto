'use client'

import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BackButton } from '@/components/BackButton'
import type { PlaceCategory } from '@/types'

export default function FavoriteSpotsPage() {
  const router = useRouter()
  const { favoritePlaces, removeFavoritePlace } = useItineraryStore()
  
  const categoryLabels: Record<PlaceCategory, string> = {
    cafe: '카페',
    restaurant: '레스토랑',
    shopping: '쇼핑',
    museum: '박물관/사원',
    themePark: '테마파크',
    nature: '자연/공원',
    other: '기타',
  }
  
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
        <Breadcrumb
          items={[
            { label: '관심 스팟' },
          ]}
        />
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
          <div className="space-y-4 md:space-y-6">
            {favoritePlaces.map((place) => (
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
                    className="ml-4 px-3 py-2 text-sm border border-gray-400 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}


