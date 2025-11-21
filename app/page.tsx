'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
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
  const [itemsPerView, setItemsPerView] = useState(1)
  const [isDesktop, setIsDesktop] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      // 각 아이템: 280px + gap 16px = 296px
      // 모바일: 1개, 태블릿: 2개, 데스크톱: 3개
      if (width >= 1024) {
        setItemsPerView(3) // 데스크톱
        setIsDesktop(true)
      } else if (width >= 768) {
        setItemsPerView(2) // 태블릿
        setIsDesktop(true)
      } else {
        setItemsPerView(1) // 모바일
        setIsDesktop(false)
      }
    }
    
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])
  
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
  
  // 스크롤 이벤트로 currentIndex 업데이트
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || recommendedItineraries.length === 0) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = 280 + 16 // 아이템 너비 + gap
      const newIndex = Math.round(scrollLeft / itemWidth)
      const maxIndex = Math.max(0, recommendedItineraries.length - itemsPerView)
      setCurrentIndex(Math.min(newIndex, maxIndex))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [recommendedItineraries.length, itemsPerView])

  const maxIndex = useMemo(() => {
    return Math.max(0, recommendedItineraries.length - itemsPerView)
  }, [recommendedItineraries.length, itemsPerView])
  
  const handlePrevious = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const itemWidth = 280 + 16
    const scrollAmount = itemWidth * itemsPerView
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }
  
  const handleNext = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const itemWidth = 280 + 16
    const scrollAmount = itemWidth * itemsPerView
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
  
  const handleDotClick = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const itemWidth = 280 + 16
    const targetScrollLeft = index * itemWidth
    container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })
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
            
            {/* 캐러셀 - 스크롤 방식 */}
            <div className="relative w-full flex justify-center">
              <div 
                ref={scrollContainerRef}
                className={`scrollbar-hide ${isDesktop ? 'overflow-x-visible' : 'overflow-x-auto'} ${isDesktop ? 'max-w-2xl' : ''}`}
                style={{ 
                  scrollSnapType: isDesktop ? 'none' : 'x mandatory',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  width: isDesktop ? '100%' : '100%'
                }}
              >
                <div 
                  className={`flex gap-4 ${isDesktop ? '' : ''}`}
                  style={{ 
                    scrollSnapAlign: 'start'
                  }}
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
                        className={isDesktop ? 'flex-1' : 'w-[280px] flex-shrink-0'}
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <button
                          onClick={() => handleSelectRecommendation(itinerary)}
                          className="w-full bg-black text-white p-6 md:p-8 hover:bg-gray-800 active:bg-gray-900 transition-all touch-manipulation rounded-2xl"
                        >
                          <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                              {days}일 여행
                            </h3>
                            <div className="space-y-2 text-sm md:text-base text-white">
                              <p>{itinerary.city}</p>
                              <p>{month}월 {startDay}일 - {endDay}일</p>
                              <p className="text-xs md:text-sm text-gray-300">
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
              
              {/* 이전/다음 버튼 - 모바일에서 숨김 */}
              {recommendedItineraries.length > itemsPerView && !isDesktop && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white border border-gray-300 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation z-10"
                    aria-label="이전"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white border border-gray-300 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation z-10"
                    aria-label="다음"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            
            {/* 인디케이터 - 슬라이드 형태 (모바일에서 숨김) */}
            {recommendedItineraries.length > itemsPerView && !isDesktop && (() => {
              const totalSlides = Math.ceil(recommendedItineraries.length / itemsPerView)
              const currentSlide = Math.floor(currentIndex / itemsPerView)
              
              return (
                <div className="hidden md:flex justify-center mt-4 w-full">
                  <div 
                    className="relative bg-gray-300 rounded-full h-1 cursor-pointer w-full"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const clickX = e.clientX - rect.left
                      const slideWidth = rect.width / totalSlides
                      const clickedSlide = Math.floor(clickX / slideWidth)
                      if (clickedSlide >= 0 && clickedSlide < totalSlides) {
                        const targetIndex = clickedSlide * itemsPerView
                        handleDotClick(Math.min(targetIndex, recommendedItineraries.length - itemsPerView))
                      }
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 bg-black rounded-full h-1 transition-all duration-300 ease-in-out"
                      style={{
                        width: `${(1 / totalSlides) * 100}%`,
                        transform: `translateX(${currentSlide * 100}%)`,
                      }}
                    />
                  </div>
                </div>
              )
            })()}
            
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
                  className="text-left border border-gray-300 p-4 md:p-5 hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation rounded-[16px]"
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
              className="block w-full text-center bg-black text-white px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-[8px]"
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

