'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useItineraryStore } from '@/store/itineraryStore'
import { generateRecommendedItineraries } from '@/lib/recommendedItineraries'

export default function Home() {
  const router = useRouter()
  const { resetOnboarding, onboardingPreferences, onboardingCompleted, setItinerary, setPreferences } = useItineraryStore()
  
  const recommendedItineraries = useMemo(() => {
    if (!onboardingPreferences || !onboardingCompleted) {
      return []
    }
    return generateRecommendedItineraries(onboardingPreferences)
  }, [onboardingPreferences, onboardingCompleted])
  
  const handleShowOnboarding = () => {
    resetOnboarding()
  }
  
  const handleSelectRecommendation = (itinerary: typeof recommendedItineraries[0]) => {
    setPreferences(itinerary.preferences)
    setItinerary(itinerary)
    router.push('/plan')
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="border-b border-gray-300 pb-6 md:pb-8 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            일본 여행 일정 자동 생성기
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
            여행 조건을 입력하시면 맞춤형 일본 여행 일정을 자동으로 생성해드립니다.
            도시, 날짜, 여행 스타일, 관심사 등을 바탕으로 최적의 일정을 제안합니다.
          </p>
        </div>
        
        {recommendedItineraries.length > 0 && (
          <div className="mb-8 md:mb-10">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">추천 일정</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              당신의 취향에 맞춘 추천 일정입니다
            </p>
            <div className="space-y-3 md:space-y-4">
              {recommendedItineraries.map((itinerary, index) => {
                const days = itinerary.days.length
                const labels = ['3일 여행', '5일 여행', '7일 여행']
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectRecommendation(itinerary)}
                    className="w-full text-left border-2 border-gray-300 p-4 md:p-5 hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg mb-1">
                          {labels[index] || `${days}일 여행`}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-2">
                          {itinerary.city} · {itinerary.startDate} ~ {itinerary.endDate}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 text-gray-700">
                            {itinerary.preferences.style === 'relaxed' ? '여유롭게' : itinerary.preferences.style === 'normal' ? '보통' : '빡빡하게'}
                          </span>
                          {itinerary.preferences.interests.length > 0 && (
                            <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 text-gray-700">
                              {itinerary.preferences.interests.length}개 관심사
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">
                          {days}일 · {itinerary.days.reduce((sum, day) => sum + day.slots.length, 0)}개 활동
                        </p>
                      </div>
                      <span className="text-gray-400 text-lg md:text-xl ml-4">→</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        
        <div className="space-y-4 md:space-y-6">
          {recommendedItineraries.length === 0 && (
            <p className="text-sm md:text-base text-gray-600">
              간단한 몇 가지 질문에 답하시면 됩니다.
            </p>
          )}
          
          <Link
            href="/plan/new"
            className="block w-full text-center border-2 border-black px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation"
          >
            일정 만들기 시작하기
          </Link>
          
          <button
            onClick={handleShowOnboarding}
            className="block w-full text-center border border-gray-400 px-6 py-3 md:py-2 text-sm md:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation text-gray-600"
          >
            온보딩 다시보기
          </button>
        </div>
      </div>
    </main>
  )
}

