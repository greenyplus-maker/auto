'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { BackButton } from '@/components/BackButton'
import type { TripPreferences, TravelGroupType } from '@/types'

const travelGroupTypes = [
  { value: 'family', label: '가족', adults: 2, children: 0, allowChildren: true, minAdults: 2, maxAdults: 4 },
  { value: 'lovers', label: '연인', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 2 },
  { value: 'friends', label: '친구', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 8 },
  { value: 'parents', label: '효도', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 4 },
] as const

const cities = ['도쿄', '오사카', '교토', '후쿠오카', '홋카이도', '오키나와', '아직 정하지 않음']
const interests = [
  { value: 'cafe', label: '카페' },
  { value: 'restaurant', label: '맛집' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'museum', label: '박물관/사원' },
  { value: 'themePark', label: '테마파크' },
  { value: 'nature', label: '자연/공원' },
]

type DateInputMode = 'calendar' | 'nights'
type Season = 'spring' | 'summer' | 'autumn' | 'winter' | ''

const seasons = [
  { value: 'spring', label: '봄 (3-5월)' },
  { value: 'summer', label: '여름 (6-8월)' },
  { value: 'autumn', label: '가을 (9-11월)' },
  { value: 'winter', label: '겨울 (12-2월)' },
]

// 시즌별 대표 날짜 계산 (올해 또는 내년)
const getSeasonStartDate = (season: Season): string => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  let year = currentYear
  let month = 1
  let day = 1
  
  switch (season) {
    case 'spring':
      month = 4 // 4월 1일
      day = 1
      // 현재가 4월 이후면 내년 봄
      if (currentMonth > 4) year = currentYear + 1
      break
    case 'summer':
      month = 7 // 7월 1일
      day = 1
      // 현재가 7월 이후면 내년 여름
      if (currentMonth > 7) year = currentYear + 1
      break
    case 'autumn':
      month = 10 // 10월 1일
      day = 1
      // 현재가 10월 이후면 내년 가을
      if (currentMonth > 10) year = currentYear + 1
      break
    case 'winter':
      month = 12 // 12월 1일
      day = 1
      // 현재가 12월 이후면 내년 겨울
      if (currentMonth > 11) year = currentYear + 1
      break
  }
  
  const date = new Date(year, month - 1, day)
  return date.toISOString().split('T')[0]
}

export default function NewPlanPage() {
  const router = useRouter()
  const { setPreferences, onboardingPreferences } = useItineraryStore()
  
  const [dateInputMode, setDateInputMode] = useState<DateInputMode>('calendar')
  const [nights, setNights] = useState<number>(3)
  const [selectedSeason, setSelectedSeason] = useState<Season>('')
  
  const [formData, setFormData] = useState<Partial<TripPreferences>>({
    city: onboardingPreferences?.city || '',
    startDate: '',
    endDate: '',
    adults: onboardingPreferences?.adults || 2,
    children: onboardingPreferences?.children || 0,
    childAgeGroups: onboardingPreferences?.childAgeGroups && onboardingPreferences.childAgeGroups.length > 0
      ? onboardingPreferences.childAgeGroups as any
      : [],
    groupType: '' as TravelGroupType,
    style: (onboardingPreferences?.style as any) || 'normal',
    interests: onboardingPreferences?.interests || [],
    budget: (onboardingPreferences?.budget as any) || 'medium',
  })
  
  
  // N박 N일 모드에서 시즌 선택 시 출발일 자동 설정
  useEffect(() => {
    if (dateInputMode === 'nights' && selectedSeason) {
      const startDate = getSeasonStartDate(selectedSeason)
      setFormData((prev) => ({ ...prev, startDate }))
    }
  }, [selectedSeason, dateInputMode])
  
  // N박 N일 모드에서 출발일 또는 일수 변경 시 귀국일 자동 계산
  useEffect(() => {
    if (dateInputMode === 'nights' && formData.startDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + nights)
      const endDateString = endDate.toISOString().split('T')[0]
      setFormData((prev) => ({ ...prev, endDate: endDateString }))
    }
  }, [formData.startDate, nights, dateInputMode])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // N박 N일 모드에서 시즌이 선택되지 않았으면 경고
    if (dateInputMode === 'nights' && !selectedSeason) {
      alert('시즌을 선택해주세요.')
      return
    }
    
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
      childAgeGroups: formData.childAgeGroups || [],
      groupType: formData.groupType || '',
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
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">여행 기간 *</label>
            
            {/* 입력 방식 선택 */}
            <div className="flex gap-2 mb-3 md:mb-4">
              <button
                type="button"
                onClick={() => {
                  setDateInputMode('calendar')
                  setFormData({ ...formData, startDate: '', endDate: '' })
                }}
                className={`flex-1 px-4 py-2 text-sm md:text-base border transition-colors touch-manipulation rounded-[8px] ${
                  dateInputMode === 'calendar'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-50'
                }`}
              >
                달력으로 선택
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateInputMode('nights')
                  setSelectedSeason('')
                  setFormData({ ...formData, startDate: '', endDate: '' })
                }}
                className={`flex-1 px-4 py-2 text-sm md:text-base border transition-colors touch-manipulation rounded-[8px] ${
                  dateInputMode === 'nights'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-50'
                }`}
              >
                N박 N일
              </button>
            </div>
            
            {/* 달력 모드 */}
            {dateInputMode === 'calendar' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-2">출발일</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-2">귀국일</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full"
                    required
                    min={formData.startDate}
                  />
                </div>
              </div>
            )}
            
            {/* N박 N일 모드 */}
            {dateInputMode === 'nights' && (
              <div className="space-y-4 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-2">시즌 선택 *</label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value as Season)}
                    className="w-full"
                    required
                  >
                    <option value="">선택하세요</option>
                    {seasons.map((season) => (
                      <option key={season.value} value={season.value}>
                        {season.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-2">여행 일수 *</label>
                  <select
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value))}
                    className="w-full"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => (
                      <option key={n} value={n}>
                        {n}박 {n + 1}일
                      </option>
                    ))}
                  </select>
                </div>
                {formData.startDate && formData.endDate && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      출발일: <span className="font-medium text-gray-900">{formData.startDate}</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      귀국일: <span className="font-medium text-gray-900">{formData.endDate}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">인원 구성 *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
              {travelGroupTypes.map((group) => (
                <button
                  key={group.value}
                  type="button"
                  onClick={() => {
                    const newAgeGroups = group.children > 0 
                      ? Array(group.children).fill('6to12' as any)
                      : []
                    setFormData({ 
                      ...formData, 
                      groupType: group.value as TravelGroupType,
                      adults: group.adults,
                      children: group.children,
                      childAgeGroups: newAgeGroups
                    })
                  }}
                  className={`border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                    formData.groupType === group.value
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">성인 수 *</label>
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {(() => {
                const selectedGroup = travelGroupTypes.find(g => g.value === formData.groupType)
                const minAdults = selectedGroup?.minAdults || 1
                const maxAdults = selectedGroup?.maxAdults || 8
                const adultOptions = Array.from({ length: maxAdults - minAdults + 1 }, (_, i) => minAdults + i)
                
                return adultOptions.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, adults: num })}
                    className={`border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                      formData.adults === num
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {num}명
                  </button>
                ))
              })()}
            </div>
          </div>
          
          {(() => {
            const selectedGroup = travelGroupTypes.find(g => g.value === formData.groupType)
            if (!selectedGroup?.allowChildren) return null
            
            return (
              <div>
                <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">아이 수</label>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    const newChildren = num
                    const currentAgeGroups = formData.childAgeGroups || []
                    let newAgeGroups: any[] = []
                    
                    if (newChildren > currentAgeGroups.length) {
                      // 아이 수가 증가하면 기본값으로 채우기
                      newAgeGroups = [...currentAgeGroups]
                      for (let i = currentAgeGroups.length; i < newChildren; i++) {
                        newAgeGroups.push('6to12')
                      }
                    } else if (newChildren < currentAgeGroups.length) {
                      // 아이 수가 감소하면 배열 자르기
                      newAgeGroups = currentAgeGroups.slice(0, newChildren)
                    } else {
                      newAgeGroups = currentAgeGroups
                    }
                    
                    setFormData({ ...formData, children: newChildren, childAgeGroups: newAgeGroups })
                  }}
                  className={`border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                    formData.children === num
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {num}명
                </button>
              ))}
                </div>
              </div>
            )
          })()}
          
          {formData.children && formData.children > 0 && (
            <div>
              <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">아이 연령대</label>
              <div className="space-y-3 md:space-y-3">
                {Array.from({ length: formData.children }).map((_, index) => (
                  <div key={index}>
                    <label className="block text-xs md:text-sm text-gray-600 mb-2">
                      {index + 1}번째 아이
                    </label>
                    <select
                      value={formData.childAgeGroups?.[index] || '6to12'}
                      onChange={(e) => {
                        const newAgeGroups = [...(formData.childAgeGroups || [])]
                        newAgeGroups[index] = e.target.value as any
                        setFormData({ ...formData, childAgeGroups: newAgeGroups })
                      }}
                      className="w-full"
                    >
                      <option value="under6">6세 미만</option>
                      <option value="6to12">6-12세</option>
                      <option value="13plus">13세 이상</option>
                    </select>
                  </div>
                ))}
              </div>
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
              className="w-full bg-black text-white px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-[8px]"
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

