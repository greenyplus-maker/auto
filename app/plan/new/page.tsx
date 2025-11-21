'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { BackButton } from '@/components/BackButton'
import type { TripPreferences } from '@/types'

const cities = ['도쿄', '오사카', '교토', '후쿠오카', '아직 정하지 않음']
const interests = [
  { value: 'cafe', label: '카페' },
  { value: 'restaurant', label: '맛집' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'museum', label: '박물관/사원' },
  { value: 'themePark', label: '테마파크' },
  { value: 'nature', label: '자연/공원' },
]

export default function NewPlanPage() {
  const router = useRouter()
  const { setPreferences, onboardingPreferences } = useItineraryStore()
  
  const [formData, setFormData] = useState<Partial<TripPreferences>>({
    city: onboardingPreferences?.city || '',
    startDate: '',
    endDate: '',
    adults: onboardingPreferences?.adults || 2,
    children: onboardingPreferences?.children || 0,
    childAgeGroup: (onboardingPreferences?.childAgeGroup as any) || '6to12',
    style: (onboardingPreferences?.style as any) || 'normal',
    interests: onboardingPreferences?.interests || [],
    budget: (onboardingPreferences?.budget as any) || 'medium',
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.city || !formData.startDate || !formData.endDate) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }
    
    const preferences: TripPreferences = {
      city: formData.city === '아직 정하지 않음' ? '도쿄' : formData.city,
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      adults: formData.adults || 2,
      children: formData.children || 0,
      childAgeGroup: formData.childAgeGroup || '6to12',
      style: formData.style || 'normal',
      interests: formData.interests || [],
      budget: formData.budget || 'medium',
    }
    
    setPreferences(preferences)
    router.push('/plan/loading')
  }
  
  const handleInterestToggle = (interest: string) => {
    const current = formData.interests || []
    if (current.includes(interest)) {
      setFormData({ ...formData, interests: current.filter((i) => i !== interest) })
    } else {
      setFormData({ ...formData, interests: [...current, interest] })
    }
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <BackButton href="/" label="홈으로" />
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">여행 조건 입력</h1>
          <p className="text-sm md:text-base text-gray-600">일정 생성을 위한 정보를 입력해주세요.</p>
        </div>
        
        <form id="plan-form" onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">도시/지역 *</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full"
              required
            >
              <option value="">선택하세요</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">출발일 *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">귀국일 *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">성인 수</label>
            <input
              type="number"
              min="1"
              value={formData.adults}
              onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">아이 수</label>
            <input
              type="number"
              min="0"
              value={formData.children}
              onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
              className="w-full"
            />
          </div>
          
          {formData.children && formData.children > 0 && (
            <div>
              <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">아이 연령대</label>
              <select
                value={formData.childAgeGroup}
                onChange={(e) => setFormData({ ...formData, childAgeGroup: e.target.value as any })}
                className="w-full"
              >
                <option value="under6">6세 미만</option>
                <option value="6to12">6-12세</option>
                <option value="13plus">13세 이상</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">여행 스타일</label>
            <select
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value as any })}
              className="w-full"
            >
              <option value="relaxed">여유롭게</option>
              <option value="normal">보통</option>
              <option value="intensive">빡빡하게</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">관심사 (복수 선택 가능)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-2 mt-2">
              {interests.map((interest) => (
                <label key={interest.value} className="flex items-center space-x-3 md:space-x-2 cursor-pointer py-2 md:py-1 touch-manipulation">
                  <input
                    type="checkbox"
                    checked={formData.interests?.includes(interest.value)}
                    onChange={() => handleInterestToggle(interest.value)}
                    className="w-5 h-5 md:w-4 md:h-4 border-gray-400 touch-manipulation"
                  />
                  <span className="text-sm md:text-sm">{interest.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">예산</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value as any })}
              className="w-full"
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </div>
          
        </form>
        
        {/* 플로팅 CTA 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 md:p-6 z-50">
          <div className="max-w-2xl mx-auto">
            <button
              type="submit"
              form="plan-form"
              className="w-full bg-black text-white px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-lg"
            >
              일정 생성하기
            </button>
          </div>
        </div>
        
        {/* 플로팅 버튼 공간 확보 */}
        <div className="h-20 md:h-24" />
      </div>
    </main>
  )
}

