'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useItineraryStore } from '@/store/itineraryStore'
import { generateRecommendedItineraries } from '@/lib/recommendedItineraries'
import { getPlacesByCity, getPopularJapanSpots } from '@/lib/mockData'
import type { Place } from '@/types'

export default function Home() {
  const router = useRouter()
  const { resetOnboarding, onboardingPreferences, onboardingCompleted, setItinerary, setPreferences } = useItineraryStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const recommendedItineraries = useMemo(() => {
    if (!onboardingPreferences || !onboardingCompleted) {
      return []
    }
    return generateRecommendedItineraries(onboardingPreferences)
  }, [onboardingPreferences, onboardingCompleted])
  
  // 관광 스팟 목록 (선호 도시가 있으면 해당 도시, 없으면 일본 유명 스팟)
  const touristSpots = useMemo(() => {
    if (!onboardingCompleted) {
      return []
    }
    
    if (onboardingPreferences?.city) {
      return getPlacesByCity(onboardingPreferences.city).slice(0, 6) // 상위 6개만 표시
    }
    
    return getPopularJapanSpots()
  }, [onboardingPreferences, onboardingCompleted])
  
  const handleSpotClick = (place: Place) => {
    router.push(`/place/${place.id}`)
  }
  
  const handleShowOnboarding = () => {
    resetOnboarding()
  }
  
  const handleSelectRecommendation = (itinerary: typeof recommendedItineraries[0]) => {
    setPreferences(itinerary.preferences)
    setItinerary(itinerary)
    router.push('/plan')
  }
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? recommendedItineraries.length - 1 : prev - 1))
  }
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === recommendedItineraries.length - 1 ? 0 : prev + 1))
  }
  
  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
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
            
            {/* 캐러셀 */}
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {recommendedItineraries.map((itinerary, index) => {
                    const days = itinerary.days.length
                    const totalActivities = itinerary.days.reduce((sum, day) => sum + day.slots.length, 0)
                    const startDate = new Date(itinerary.startDate)
                    const endDate = new Date(itinerary.endDate)
                    const month = startDate.getMonth() + 1
                    const startDay = startDate.getDate()
                    const endDay = endDate.getDate()
                    
                    return (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <button
                          onClick={() => handleSelectRecommendation(itinerary)}
                          className="w-full border-2 border-gray-300 p-6 md:p-8 hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation"
                        >
                          <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">
                              {days}일 여행
                            </h3>
                            <div className="space-y-2 text-sm md:text-base text-gray-600">
                              <p>{itinerary.city}</p>
                              <p>{month}월 {startDay}일 - {endDay}일</p>
                              <p className="text-xs md:text-sm text-gray-500">
                                {totalActivities}개 활동
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* 이전/다음 버튼 */}
              {recommendedItineraries.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white border border-gray-300 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation"
                    aria-label="이전"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white border border-gray-300 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation"
                    aria-label="다음"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            
            {/* 인디케이터 */}
            {recommendedItineraries.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {recommendedItineraries.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full transition-all touch-manipulation ${
                      currentIndex === index
                        ? 'bg-black w-6'
                        : 'bg-gray-300'
                    }`}
                    aria-label={`${index + 1}번째 추천 일정`}
                  />
                ))}
              </div>
            )}
            
            {/* 온보딩 다시보기 버튼 */}
            <div className="mt-4 md:mt-6">
              <button
                onClick={handleShowOnboarding}
                className="block w-full text-center border border-gray-400 px-6 py-3 md:py-2 text-sm md:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation text-gray-600"
              >
                온보딩 다시보기
              </button>
            </div>
          </div>
        )}
        
        {/* 관광 스팟 섹션 */}
        {touristSpots.length > 0 && (
          <div className="mb-8 md:mb-10">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
              {onboardingPreferences?.city ? `${onboardingPreferences.city} 관광 스팟` : '일본 유명 스팟'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {touristSpots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className="text-left border border-gray-300 p-4 md:p-5 hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation"
                >
                  <h3 className="font-semibold text-base md:text-lg mb-2">{spot.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-2">{spot.area}</p>
                  <p className="text-sm md:text-base text-gray-700 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {recommendedItineraries.length === 0 && (
          <div className="mb-8 md:mb-10">
            <p className="text-sm md:text-base text-gray-600 mb-4">
              간단한 몇 가지 질문에 답하시면 됩니다.
            </p>
            <button
              onClick={handleShowOnboarding}
              className="block w-full text-center border border-gray-400 px-6 py-3 md:py-2 text-sm md:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation text-gray-600"
            >
              온보딩 다시보기
            </button>
          </div>
        )}
        
        {/* 플로팅 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 md:p-6 z-50">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/plan/new"
              className="block w-full text-center bg-black text-white px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-lg"
            >
              일정 만들기 시작하기
            </Link>
          </div>
        </div>
        
        {/* 플로팅 버튼 공간 확보 */}
        <div className="h-20 md:h-24" />
      </div>
    </main>
  )
}

