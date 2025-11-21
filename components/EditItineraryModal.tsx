'use client'

import { useState, useEffect } from 'react'
import { generateItinerary } from '@/lib/itineraryGenerator'
import type { TripPreferences, TravelGroupType, ChildAgeGroup } from '@/types'

const travelGroupTypes = [
  { value: 'family', label: '가족', adults: 2, children: 0, allowChildren: true, minAdults: 2, maxAdults: 4 },
  { value: 'lovers', label: '연인', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 2 },
  { value: 'friends', label: '친구', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 8 },
  { value: 'parents', label: '효도', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 4 },
] as const

const cities = ['도쿄', '오사카', '교토', '후쿠오카', '홋카이도', '오키나와', '다카마쓰', '아직 정하지 않음']
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

const getSeasonStartDate = (season: Season): string => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  let year = currentYear
  let month = 1
  let day = 1
  
  switch (season) {
    case 'spring':
      month = 4
      day = 1
      if (currentMonth > 4) year = currentYear + 1
      break
    case 'summer':
      month = 7
      day = 1
      if (currentMonth > 7) year = currentYear + 1
      break
    case 'autumn':
      month = 10
      day = 1
      if (currentMonth > 10) year = currentYear + 1
      break
    case 'winter':
      month = 12
      day = 1
      if (currentMonth > 11) year = currentYear + 1
      break
  }
  
  const date = new Date(year, month - 1, day)
  return date.toISOString().split('T')[0]
}

interface EditItineraryModalProps {
  isOpen: boolean
  onClose: () => void
  initialPreferences: TripPreferences
  onSave: (preferences: TripPreferences) => void
}

export function EditItineraryModal({ isOpen, onClose, initialPreferences, onSave }: EditItineraryModalProps) {
  const [dateInputMode, setDateInputMode] = useState<DateInputMode>('calendar')
  const [nights, setNights] = useState<number>(3)
  const [selectedSeason, setSelectedSeason] = useState<Season>('')
  
  const [formData, setFormData] = useState<Partial<TripPreferences>>({
    city: initialPreferences.city,
    startDate: initialPreferences.startDate,
    endDate: initialPreferences.endDate,
    adults: initialPreferences.adults,
    children: initialPreferences.children,
    childAgeGroups: initialPreferences.childAgeGroups || [],
    groupType: initialPreferences.groupType,
    style: initialPreferences.style,
    interests: initialPreferences.interests || [],
    budget: initialPreferences.budget,
  })

  // 초기값 설정
  useEffect(() => {
    if (isOpen) {
      setFormData({
        city: initialPreferences.city,
        startDate: initialPreferences.startDate,
        endDate: initialPreferences.endDate,
        adults: initialPreferences.adults,
        children: initialPreferences.children,
        childAgeGroups: initialPreferences.childAgeGroups || [],
        groupType: initialPreferences.groupType,
        style: initialPreferences.style,
        interests: initialPreferences.interests || [],
        budget: initialPreferences.budget,
      })
    }
  }, [isOpen, initialPreferences])

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

  const getPreferencesSummary = (prefs: Partial<TripPreferences>): string => {
    const city = prefs.city === '아직 정하지 않음' ? '도쿄' : prefs.city || ''
    const startDate = prefs.startDate || ''
    const endDate = prefs.endDate || ''
    const adults = prefs.adults || 2
    const children = prefs.children || 0
    const style = prefs.style === 'relaxed' ? '여유롭게' : prefs.style === 'normal' ? '보통' : '빡빡하게'
    const budget = prefs.budget === 'low' ? '저예산' : prefs.budget === 'medium' ? '보통' : '고예산'
    const interestsList = (prefs.interests || []).map(i => {
      const interest = interests.find(int => int.value === i)
      return interest?.label || i
    }).join(', ') || '없음'
    
    let summary = `도시: ${city}\n`
    summary += `여행 기간: ${startDate} ~ ${endDate}\n`
    summary += `인원: 성인 ${adults}명`
    if (children > 0) {
      summary += `, 아이 ${children}명`
    }
    summary += `\n여행 스타일: ${style}\n`
    summary += `관심사: ${interestsList}\n`
    summary += `예산: ${budget}`
    
    return summary
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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
    
    // 조건 요약과 함께 확인 알럿 표시
    const summary = getPreferencesSummary(preferences)
    const confirmMessage = `다음 조건으로 일정을 재생성하시겠습니까?\n\n${summary}`
    
    if (confirm(confirmMessage)) {
      onSave(preferences)
    }
  }

  const handleInterestToggle = (interest: string) => {
    const current = formData.interests || []
    if (current.includes(interest)) {
      setFormData({ ...formData, interests: current.filter((i) => i !== interest) })
    } else {
      setFormData({ ...formData, interests: [...current, interest] })
    }
  }

  if (!isOpen) return null

  const selectedGroup = travelGroupTypes.find((g) => g.value === formData.groupType)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-300 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold">일정 조건 수정</h2>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <form id="edit-itinerary-form" onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
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
              <div className="space-y-4 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-2">여행 그룹 유형</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {travelGroupTypes.map((group) => (
                      <button
                        key={group.value}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            groupType: group.value as TravelGroupType,
                            adults: group.adults,
                            children: group.children,
                            childAgeGroups: group.children > 0 ? Array(group.children).fill('6to12' as ChildAgeGroup) : [],
                          })
                        }}
                        className={`px-3 py-2 text-sm md:text-base border-2 transition-colors touch-manipulation rounded-[8px] ${
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
                  <label className="block text-xs md:text-sm text-gray-600 mb-2">성인 수</label>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          const newAdults = num
                          const maxAdults = selectedGroup?.maxAdults || 8
                          const minAdults = selectedGroup?.minAdults || 1
                          if (newAdults >= minAdults && newAdults <= maxAdults) {
                            setFormData({ ...formData, adults: newAdults })
                          }
                        }}
                        disabled={selectedGroup ? (num < selectedGroup.minAdults || num > selectedGroup.maxAdults) : false}
                        className={`flex-1 border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                          formData.adults === num
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed'
                        }`}
                      >
                        {num}명
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedGroup?.allowChildren && (
                  <>
                    <div>
                      <label className="block text-xs md:text-sm text-gray-600 mb-2">아이 수</label>
                      <div className="flex gap-2 flex-wrap">
                        {[0, 1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              const newAgeGroups = num > 0 ? Array(num).fill('6to12' as ChildAgeGroup) : []
                              setFormData({ ...formData, children: num, childAgeGroups: newAgeGroups })
                            }}
                            className={`flex-1 border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
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
                    
                    {(formData.children || 0) > 0 && (
                      <div>
                        <label className="block text-xs md:text-sm text-gray-600 mb-2">아이 연령대</label>
                        <div className="space-y-3">
                          {Array.from({ length: formData.children || 0 }).map((_, index) => {
                            const currentAgeGroups = formData.childAgeGroups || []
                            const currentAgeGroup = currentAgeGroups[index] || '6to12'
                            return (
                              <div key={index}>
                                <label className="block text-xs md:text-sm text-gray-600 mb-2">
                                  {index + 1}번째 아이
                                </label>
                                <div className="space-y-2">
                                  {(['under6', '6to12', '13plus'] as ChildAgeGroup[]).map((ageGroup) => (
                                    <button
                                      key={ageGroup}
                                      type="button"
                                      onClick={() => {
                                        const newAgeGroups = [...(formData.childAgeGroups || [])]
                                        newAgeGroups[index] = ageGroup
                                        setFormData({ ...formData, childAgeGroups: newAgeGroups })
                                      }}
                                      className={`w-full border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                                        currentAgeGroup === ageGroup
                                          ? 'border-black bg-black text-white'
                                          : 'border-gray-300 hover:border-gray-400'
                                      }`}
                                    >
                                      {ageGroup === 'under6' ? '6세 미만' : ageGroup === '6to12' ? '6-12세' : '13세 이상'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">여행 스타일 *</label>
              <div className="flex gap-2">
                {(['relaxed', 'normal', 'intensive'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, style })}
                    className={`flex-1 border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                      formData.style === style
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {style === 'relaxed' ? '여유롭게' : style === 'normal' ? '보통' : '빡빡하게'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">관심사</label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const isSelected = formData.interests?.includes(interest.value)
                  return (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => handleInterestToggle(interest.value)}
                      className={`px-4 py-2 text-sm md:text-base border-2 transition-colors touch-manipulation rounded-[8px] ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {interest.label}
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div>
              <label className="block text-sm md:text-base font-medium mb-2 md:mb-3">예산 *</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((budget) => (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget })}
                    className={`flex-1 border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                      formData.budget === budget
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {budget === 'low' ? '저예산' : budget === 'medium' ? '보통' : '고예산'}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-gray-300 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-400 px-4 py-3 md:py-2 text-sm md:text-base hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation rounded-[8px]"
          >
            취소
          </button>
          <button
            type="submit"
            form="edit-itinerary-form"
            className="flex-1 bg-black text-white px-4 py-3 md:py-2 text-sm md:text-base hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-[8px]"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

