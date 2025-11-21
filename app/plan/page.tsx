'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useItineraryStore } from '@/store/itineraryStore'
import { generateItinerary } from '@/lib/itineraryGenerator'
import type { TravelStyle } from '@/types'

export default function PlanPage() {
  const router = useRouter()
  const { itinerary, preferences, setItinerary, updateItinerary } = useItineraryStore()
  const [scheduleDensity, setScheduleDensity] = useState<TravelStyle>('normal')
  const [childFriendly, setChildFriendly] = useState(false)
  
  useEffect(() => {
    if (!itinerary || !preferences) {
      router.push('/plan/new')
      return
    }
  }, [itinerary, preferences, router])
  
  const handleRegenerate = () => {
    if (!preferences) return
    
    const newPreferences = {
      ...preferences,
      style: scheduleDensity,
    }
    
    const newItinerary = generateItinerary(newPreferences)
    updateItinerary(newItinerary)
  }
  
  if (!itinerary || !preferences) {
    return null
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">여행 일정</h1>
          <p className="text-sm md:text-base text-gray-600">
            {itinerary.city} · {itinerary.startDate} ~ {itinerary.endDate}
          </p>
        </div>
        
        <div className="mb-6 md:mb-8 space-y-4 p-4 md:p-6 border border-gray-300 bg-gray-50">
          <div>
            <label className="block text-sm md:text-base font-medium mb-3 md:mb-2">일정 밀도</label>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {(['relaxed', 'normal', 'intensive'] as TravelStyle[]).map((style) => (
                <label key={style} className="flex items-center space-x-2 md:space-x-2 cursor-pointer py-2 md:py-1 touch-manipulation">
                  <input
                    type="radio"
                    name="density"
                    value={style}
                    checked={scheduleDensity === style}
                    onChange={(e) => setScheduleDensity(e.target.value as TravelStyle)}
                    className="w-5 h-5 md:w-4 md:h-4 border-gray-400 touch-manipulation"
                  />
                  <span className="text-sm md:text-sm">
                    {style === 'relaxed' ? '여유롭게' : style === 'normal' ? '보통' : '빡빡하게'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="flex items-center space-x-3 md:space-x-2 cursor-pointer py-2 md:py-1 touch-manipulation">
              <input
                type="checkbox"
                checked={childFriendly}
                onChange={(e) => setChildFriendly(e.target.checked)}
                className="w-5 h-5 md:w-4 md:h-4 border-gray-400 touch-manipulation"
              />
              <span className="text-sm md:text-sm">아이 친화적</span>
            </label>
          </div>
          
          <button
            onClick={handleRegenerate}
            className="w-full md:w-auto border border-black px-6 py-3 md:px-4 md:py-2 text-sm md:text-sm font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation"
          >
            새 옵션으로 재생성
          </button>
        </div>
        
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold">일별 일정</h2>
          {itinerary.days.map((day) => (
            <Link
              key={day.index}
              href={`/plan/day/${day.index}`}
              className="block border border-gray-300 p-4 md:p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation rounded-[16px]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Day {day.index + 1}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-1">{day.summary}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {day.slots.length}개 활동
                  </p>
                </div>
                <span className="text-gray-400 text-lg md:text-xl ml-4">→</span>
              </div>
            </Link>
          ))}
        </div>
        
        {/* 플로팅 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 md:p-6 z-50">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/plan/share"
              className="block w-full text-center bg-black text-white px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-[8px]"
            >
              일정 공유하기
            </Link>
          </div>
        </div>
        
        {/* 플로팅 버튼 공간 확보 */}
        <div className="h-20 md:h-24" />
      </div>
    </main>
  )
}

