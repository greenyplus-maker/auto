'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { getPlacesByCity } from '@/lib/mockData'
import { BackButton } from '@/components/BackButton'

export default function SharePage() {
  const router = useRouter()
  const { itinerary, preferences } = useItineraryStore()
  const [copiedText, setCopiedText] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  
  useEffect(() => {
    if (!itinerary || !preferences) {
      router.push('/plan')
      return
    }
  }, [itinerary, preferences, router])
  
  if (!itinerary || !preferences) {
    return null
  }
  
  const allPlaces = getPlacesByCity(itinerary.city)
  const placeMap = new Map(allPlaces.map((p) => [p.id, p]))
  
  const generateText = () => {
    let text = `일본 여행 일정\n`
    text += `================\n\n`
    text += `도시: ${itinerary.city}\n`
    text += `기간: ${itinerary.startDate} ~ ${itinerary.endDate}\n`
    text += `여행자: 성인 ${preferences.adults}명`
    if (preferences.children > 0) {
      text += `, 아이 ${preferences.children}명`
    }
    text += `\n`
    text += `여행 스타일: ${preferences.style === 'relaxed' ? '여유롭게' : preferences.style === 'normal' ? '보통' : '빡빡하게'}\n`
    text += `예산: ${preferences.budget === 'low' ? '낮음' : preferences.budget === 'medium' ? '보통' : '높음'}\n\n`
    
    text += `일별 일정\n`
    text += `================\n\n`
    
    itinerary.days.forEach((day) => {
      text += `Day ${day.index + 1}: ${day.summary}\n`
      text += `-`.repeat(30) + `\n`
      
      day.slots.forEach((slot) => {
        const place = placeMap.get(slot.placeId)
        if (place) {
          text += `${slot.label}\n`
          text += `  장소: ${place.name}\n`
          text += `  지역: ${place.area}\n`
          text += `  설명: ${place.description}\n\n`
        }
      })
      
      text += `\n`
    })
    
    return text
  }
  
  const handleCopyText = async () => {
    const text = generateText()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(true)
      setTimeout(() => setCopiedText(false), 2000)
    } catch (err) {
      alert('복사에 실패했습니다.')
    }
  }

  const handleCopyLink = async () => {
    const currentUrl = window.location.origin + '/plan'
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      alert('링크 복사에 실패했습니다.')
    }
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/plan" label="일정 보기로" />
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">일정 공유</h1>
          <p className="text-sm md:text-base text-gray-600">일정을 공유하거나 텍스트로 복사할 수 있습니다.</p>
        </div>
        
        {/* 일정 정보 블록 */}
        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {/* 기본 정보 */}
          <div className="border border-gray-300 p-4 md:p-6 rounded-[16px]">
            <h2 className="text-base md:text-lg font-semibold mb-4">여행 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-1">도시</p>
                <p className="text-sm md:text-base font-medium">{itinerary.city}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-1">기간</p>
                <p className="text-sm md:text-base font-medium">{itinerary.startDate} ~ {itinerary.endDate}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-1">인원</p>
                <p className="text-sm md:text-base font-medium">
                  성인 {preferences.adults}명
                  {preferences.children > 0 && ` · 아이 ${preferences.children}명`}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-1">여행 스타일</p>
                <p className="text-sm md:text-base font-medium">
                  {preferences.style === 'relaxed' ? '여유롭게' : preferences.style === 'normal' ? '보통' : '빡빡하게'}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 mb-1">예산</p>
                <p className="text-sm md:text-base font-medium">
                  {preferences.budget === 'low' ? '저예산' : preferences.budget === 'medium' ? '보통' : '고예산'}
                </p>
              </div>
            </div>
          </div>

          {/* 일별 일정 */}
          {itinerary.days.map((day) => {
            const dayPlaces = day.slots.map(slot => placeMap.get(slot.placeId)).filter(Boolean)
            return (
              <div key={day.index} className="border border-gray-300 p-4 md:p-6 rounded-[16px]">
                <h2 className="text-base md:text-lg font-semibold mb-3">
                  Day {day.index + 1}: {day.summary}
                </h2>
                <div className="space-y-3">
                  {day.slots.map((slot, slotIndex) => {
                    const place = placeMap.get(slot.placeId)
                    if (!place) return null
                    return (
                      <div key={slot.id} className="border-l-2 border-gray-300 pl-4 py-2">
                        <p className="text-xs md:text-sm text-gray-500 mb-1">{slot.label}</p>
                        <p className="text-sm md:text-base font-medium mb-1">{place.name}</p>
                        <p className="text-xs md:text-sm text-gray-600">{place.area} · {place.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* 공유 옵션 */}
        <div className="border border-gray-300 p-4 md:p-6 rounded-[16px] mb-20 md:mb-24">
          <h2 className="text-base md:text-lg font-semibold mb-4">공유하기</h2>
          <div className="space-y-3">
            <button
              onClick={handleCopyLink}
              className="w-full border border-black px-4 py-3 md:py-2 text-sm md:text-base font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation rounded-[8px] flex items-center justify-center gap-2"
            >
              <span>{copiedLink ? '✓ 링크 복사됨!' : '🔗 링크 복사'}</span>
            </button>
            <button
              onClick={handleCopyText}
              className="w-full border border-gray-400 px-4 py-3 md:py-2 text-sm md:text-base font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation rounded-[8px] flex items-center justify-center gap-2"
            >
              <span>{copiedText ? '✓ 텍스트 복사됨!' : '📋 텍스트로 복사'}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

