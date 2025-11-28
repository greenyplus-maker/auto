'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import type { TravelStyle, Budget, ChildAgeGroup, TravelGroupType } from '@/types'
import { decideCharacter, characterMetadata } from '@/lib/travelCharacter'

const travelGroupTypes = [
  { value: 'family', label: '가족', adults: 2, children: 0, allowChildren: true, minAdults: 2, maxAdults: 4 },
  { value: 'lovers', label: '연인', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 2 },
  { value: 'friends', label: '친구', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 8 },
  { value: 'parents', label: '효도', adults: 2, children: 0, allowChildren: false, minAdults: 2, maxAdults: 4 },
] as const

interface OnboardingPreferences {
  style: TravelStyle | null
  interests: string[]
  budget: Budget | null
  adults: number
  children: number
  childAgeGroups: ChildAgeGroup[] | null
  groupType: TravelGroupType | null
  city: string | null
}

const interests = [
  { value: 'cafe', label: '카페' },
  { value: 'restaurant', label: '맛집' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'museum', label: '박물관/사원' },
  { value: 'themePark', label: '테마파크' },
  { value: 'nature', label: '자연/공원' },
]

const cities = ['도쿄', '오사카', '교토', '후쿠오카', '홋카이도', '오키나와', '다카마쓰', '아직 정하지 않음']

export function Onboarding() {
  const router = useRouter()
  const { onboardingCompleted, showOnboarding, completeOnboarding, setOnboardingPreferences, setOnboardingCharacter } = useItineraryStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    style: null,
    interests: [],
    budget: null,
    adults: 2,
    children: 0,
    childAgeGroups: null,
    groupType: null,
    city: null,
  })
  const characterType = useMemo(() => decideCharacter(preferences), [preferences])
  const characterInfo = characterMetadata[characterType]
  
  useEffect(() => {
    setMounted(true)
    if (showOnboarding || !onboardingCompleted) {
      try {
        const stored = localStorage.getItem('itinerary-storage')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.state?.onboardingCompleted && !parsed?.state?.showOnboarding) {
            setShouldShow(false)
            return
          }
        }
        setShouldShow(true)
      } catch (e) {
        setShouldShow(true)
      }
    } else {
      setShouldShow(false)
    }
  }, [showOnboarding, onboardingCompleted])
  
  if (!mounted || !shouldShow) {
    return null
  }
  
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSkip = () => {
    handleComplete()
  }
  
  const handleComplete = () => {
    // 수집한 취향 정보 저장
    setOnboardingPreferences(preferences)
    setOnboardingCharacter(characterType)
    completeOnboarding()
    router.push('/main')
  }
  
  const handleInterestToggle = (interest: string) => {
    const current = preferences.interests || []
    if (current.includes(interest)) {
      setPreferences({ ...preferences, interests: current.filter((i) => i !== interest) })
    } else {
      setPreferences({ ...preferences, interests: [...current, interest] })
    }
  }
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // 여행 스타일
        return (
          <div className="space-y-4">
            <p className="text-sm md:text-base text-gray-600 mb-4">
              어떤 여행 스타일을 선호하시나요?
            </p>
            <div className="space-y-3">
              {(['relaxed', 'normal', 'intensive'] as TravelStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setPreferences({ ...preferences, style })}
                  className={`w-full text-left border-2 p-4 transition-colors touch-manipulation rounded-[8px] ${
                    preferences.style === style
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm md:text-base mb-1">
                    {style === 'relaxed' ? '여유롭게' : style === 'normal' ? '보통' : '빡빡하게'}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {style === 'relaxed' 
                      ? '하루에 2-3개 활동, 여유로운 일정'
                      : style === 'normal'
                      ? '하루에 3-4개 활동, 균형잡힌 일정'
                      : '하루에 4-5개 활동, 알찬 일정'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      
      case 1: // 관심사
        return (
          <div className="space-y-4">
            <p className="text-sm md:text-base text-gray-600 mb-4">
              관심 있는 활동을 선택해주세요 (복수 선택 가능)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map((interest) => (
                <button
                  key={interest.value}
                  onClick={() => handleInterestToggle(interest.value)}
                  className={`border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                    preferences.interests.includes(interest.value)
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 2: // 예산
        return (
          <div className="space-y-4">
            <p className="text-sm md:text-base text-gray-600 mb-4">
              예산 수준을 선택해주세요
            </p>
            <div className="space-y-3">
              {(['low', 'medium', 'high'] as Budget[]).map((budget) => (
                <button
                  key={budget}
                  onClick={() => setPreferences({ ...preferences, budget })}
                  className={`w-full text-left border-2 p-4 transition-colors touch-manipulation rounded-[8px] ${
                    preferences.budget === budget
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm md:text-base mb-1">
                    {budget === 'low' ? '낮음' : budget === 'medium' ? '보통' : '높음'}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {budget === 'low'
                      ? '저렴한 식당과 무료 관광지 중심'
                      : budget === 'medium'
                      ? '적당한 가격대의 식당과 관광지'
                      : '고급 레스토랑과 프리미엄 경험'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      
      case 3: // 여행자 구성
        return (
          <div className="space-y-6">
            <p className="text-sm md:text-base text-gray-600 mb-4">
              여행 인원을 알려주세요
            </p>
            <div>
              <label className="block text-sm md:text-base font-medium mb-2">인원 구성</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
                {travelGroupTypes.map((group) => (
                  <button
                    key={group.value}
                    type="button"
                    onClick={() => {
                      const newAgeGroups = group.children > 0 
                        ? Array(group.children).fill('6to12' as ChildAgeGroup)
                        : null
                      setPreferences({ 
                        ...preferences, 
                        groupType: group.value as TravelGroupType,
                        adults: group.adults,
                        children: group.children,
                        childAgeGroups: newAgeGroups
                      })
                    }}
                    className={`border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                      preferences.groupType === group.value
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
              <label className="block text-sm md:text-base font-medium mb-2">성인 수</label>
              <div className="flex gap-2 flex-wrap">
                {(() => {
                  const selectedGroup = travelGroupTypes.find(g => g.value === preferences.groupType)
                  const minAdults = selectedGroup?.minAdults || 1
                  const maxAdults = selectedGroup?.maxAdults || 5
                  const adultOptions = Array.from({ length: maxAdults - minAdults + 1 }, (_, i) => minAdults + i)
                  
                  return adultOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setPreferences({ ...preferences, adults: num })}
                      className={`flex-1 border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                        preferences.adults === num
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
              const selectedGroup = travelGroupTypes.find(g => g.value === preferences.groupType)
              if (!selectedGroup?.allowChildren) return null
              
              return (
                <div>
                  <label className="block text-sm md:text-base font-medium mb-2">아이 수</label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const newAgeGroups = num > 0 
                            ? Array(num).fill('6to12' as ChildAgeGroup)
                            : null
                          setPreferences({ ...preferences, children: num, childAgeGroups: newAgeGroups })
                        }}
                        className={`flex-1 border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
                          preferences.children === num
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
            {preferences.children > 0 && (
              <div>
                <label className="block text-sm md:text-base font-medium mb-2">아이 연령대</label>
                <div className="space-y-3">
                  {Array.from({ length: preferences.children }).map((_, index) => {
                    const currentAgeGroups = preferences.childAgeGroups || []
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
                                const newAgeGroups = [...(preferences.childAgeGroups || [])]
                                newAgeGroups[index] = ageGroup
                                setPreferences({ ...preferences, childAgeGroups: newAgeGroups })
                              }}
                              className={`w-full text-left border-2 p-3 md:p-4 text-sm md:text-base transition-colors touch-manipulation rounded-[8px] ${
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
          </div>
        )
      
      case 4: // 선호 도시
        return (
          <div className="space-y-4">
            <p className="text-sm md:text-base text-gray-600 mb-4">
              선호하는 도시나 지역을 선택해주세요
            </p>
            <div className="space-y-3">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setPreferences({ ...preferences, city })}
                  className={`w-full text-left border-2 p-4 transition-colors touch-manipulation rounded-[8px] ${
                    preferences.city === city
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm md:text-base">{city}</div>
                </button>
              ))}
            </div>
          </div>
        )
      
      case 5: // 서머리
        return (
          <div className="space-y-4">
            <p className="text-sm md:text-base text-gray-600 mb-6">
              선택하신 정보를 확인해주세요
            </p>
            <div className="border border-gray-300 p-4 rounded-[16px] bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{characterInfo.icon}</span>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">여행 캐릭터</p>
                  <h3 className="text-base md:text-lg font-semibold">{characterInfo.name}</h3>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {characterInfo.description}
              </p>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-300 p-4 rounded-[16px]">
                <h3 className="text-sm md:text-base font-semibold mb-2">여행 스타일</h3>
                <p className="text-sm md:text-base text-gray-700">
                  {preferences.style === 'relaxed' ? '여유롭게' : preferences.style === 'normal' ? '보통' : '빡빡하게'}
                </p>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-[16px]">
                <h3 className="text-sm md:text-base font-semibold mb-2">관심 활동</h3>
                {preferences.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {preferences.interests.map((interest) => {
                      const interestLabel = interests.find((i) => i.value === interest)?.label
                      return (
                        <span key={interest} className="text-xs md:text-sm px-2 py-1 bg-gray-100 text-gray-700">
                          {interestLabel}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-500">선택하지 않음</p>
                )}
              </div>
              
              <div className="border border-gray-300 p-4 rounded-[16px]">
                <h3 className="text-sm md:text-base font-semibold mb-2">예산 수준</h3>
                <p className="text-sm md:text-base text-gray-700">
                  {preferences.budget === 'low' ? '낮음' : preferences.budget === 'medium' ? '보통' : '높음'}
                </p>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-[16px]">
                <h3 className="text-sm md:text-base font-semibold mb-2">여행 인원</h3>
                <p className="text-sm md:text-base text-gray-700">
                  {preferences.groupType && (
                    <span className="block mb-1">
                      {travelGroupTypes.find(g => g.value === preferences.groupType)?.label || '기타'}
                    </span>
                  )}
                  성인 {preferences.adults}명
                  {preferences.children > 0 && (
                    <>
                      {' · '}
                      아이 {preferences.children}명
                      {preferences.childAgeGroups && preferences.childAgeGroups.length > 0 && (
                        <span className="block mt-1 text-xs md:text-sm text-gray-600">
                          {preferences.childAgeGroups.map((ageGroup, index) => (
                            <span key={index}>
                              {index > 0 && ', '}
                              {index + 1}번째: {ageGroup === 'under6' ? '6세 미만' : ageGroup === '6to12' ? '6-12세' : '13세 이상'}
                            </span>
                          ))}
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-[16px]">
                <h3 className="text-sm md:text-base font-semibold mb-2">선호 도시</h3>
                <p className="text-sm md:text-base text-gray-700">
                  {preferences.city || '선택하지 않음'}
                </p>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  const stepTitles = [
    '여행 스타일',
    '관심 활동',
    '예산 수준',
    '여행 인원',
    '선호 도시',
    '확인',
  ]
  
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return preferences.style !== null
      case 1:
        return true // 관심사는 선택사항
      case 2:
        return preferences.budget !== null
      case 3:
        return preferences.adults > 0 && (preferences.children === 0 || (preferences.childAgeGroups && preferences.childAgeGroups.length === preferences.children))
      case 4:
        return preferences.city !== null
      case 5:
        return true // 서머리는 항상 진행 가능
      default:
        return false
    }
  }
  
  const isLastStep = currentStep === 5
  
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-y-auto">
      <div className="max-w-[600px] w-full my-auto px-6">
        <div className="bg-white">
          {/* 진행 표시 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm text-gray-600">
                {currentStep + 1} / 6
              </span>
              <button
                onClick={handleSkip}
                className="text-xs md:text-sm text-gray-600 hover:text-black transition-colors touch-manipulation"
              >
                건너뛰기
              </button>
            </div>
            <div className="w-full h-1 bg-gray-200">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* 콘텐츠 */}
          <div className="mb-8 min-h-[300px] md:min-h-[350px]">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 leading-tight">
              {stepTitles[currentStep]}
            </h2>
            {renderStepContent()}
          </div>
          
          {/* 버튼 */}
          <div className="flex gap-3 md:gap-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 border border-gray-400 px-4 py-3 md:py-2 text-sm md:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              >
                이전
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`${currentStep > 0 ? 'flex-1' : 'w-full'} border-2 border-black px-4 py-3 md:py-2 text-sm md:text-sm font-medium transition-colors touch-manipulation ${
                canProceed()
                  ? 'hover:bg-black hover:text-white active:bg-gray-800'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isLastStep ? '완료' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
