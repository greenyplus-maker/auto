'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { getPlacesByCity } from '@/lib/mockData'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BackButton } from '@/components/BackButton'

export default function SharePage() {
  const router = useRouter()
  const { itinerary, preferences } = useItineraryStore()
  const [copied, setCopied] = useState(false)
  
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
  
  const handleCopy = async () => {
    const text = generateText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('복사에 실패했습니다.')
    }
  }
  
  const textContent = generateText()
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <BackButton href="/plan" label="일정 보기로" />
        <Breadcrumb
          items={[
            { label: '일정 보기', href: '/plan' },
            { label: '공유' },
          ]}
        />
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">일정 공유</h1>
          <p className="text-sm md:text-base text-gray-600">일정을 텍스트로 복사하여 공유하세요.</p>
        </div>
        
        <div className="mb-6">
          <button
            onClick={handleCopy}
            className="w-full md:w-auto border-2 border-black px-6 py-3 md:py-2 text-base md:text-sm font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation"
          >
            {copied ? '복사됨!' : '클립보드에 복사'}
          </button>
        </div>
        
        <div className="border border-gray-300 p-4 md:p-6 bg-gray-50 overflow-x-auto">
          <pre className="whitespace-pre-wrap text-xs md:text-sm font-mono text-gray-800 leading-relaxed">
            {textContent}
          </pre>
        </div>
      </div>
    </main>
  )
}

