'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { generateItinerary } from '@/lib/itineraryGenerator'

export default function LoadingPage() {
  const router = useRouter()
  const { preferences, setItinerary } = useItineraryStore()
  
  useEffect(() => {
    if (!preferences) {
      router.push('/plan/new')
      return
    }
    
    // 일정 생성 시뮬레이션
    const timer = setTimeout(() => {
      const itinerary = generateItinerary(preferences)
      setItinerary(itinerary)
      router.push('/plan')
    }, 2000) // 2초 대기
    
    return () => clearTimeout(timer)
  }, [preferences, router, setItinerary])
  
  if (!preferences) {
    return null
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="border-b border-gray-300 pb-6 md:pb-8 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight">일정 생성 중...</h1>
          <p className="text-sm md:text-base text-gray-700 mb-2">
            {preferences.city} 여행 일정을 생성하고 있습니다.
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">
            {preferences.startDate} ~ {preferences.endDate}
          </p>
          <p className="text-xs md:text-sm text-gray-600">
            여행 스타일: {preferences.style === 'relaxed' ? '여유롭게' : preferences.style === 'normal' ? '보통' : '빡빡하게'}
          </p>
        </div>
        
        <div className="space-y-3 md:space-y-2">
          <div className="w-full h-2 md:h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black animate-pulse transition-all" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm md:text-sm text-gray-600">잠시만 기다려주세요...</p>
        </div>
      </div>
    </main>
  )
}

