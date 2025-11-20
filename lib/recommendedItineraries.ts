import type { TripPreferences, Itinerary } from '@/types'
import { generateItinerary } from './itineraryGenerator'

interface OnboardingPreferences {
  style: string | null
  interests: string[]
  budget: string | null
  adults: number
  children: number
  childAgeGroup: string | null
  city: string | null
}

export function generateRecommendedItineraries(
  onboardingPrefs: OnboardingPreferences
): Itinerary[] {
  if (!onboardingPrefs.city || !onboardingPrefs.style || !onboardingPrefs.budget) {
    return []
  }

  const city = onboardingPrefs.city === '아직 정하지 않음' ? '도쿄' : onboardingPrefs.city
  
  // 오늘부터 시작하는 3가지 기간의 추천 일정
  const today = new Date()
  const recommendations = [
    {
      days: 3,
      label: '3일 여행',
      description: '짧고 알찬 여행',
    },
    {
      days: 5,
      label: '5일 여행',
      description: '적당한 기간의 여행',
    },
    {
      days: 7,
      label: '7일 여행',
      description: '여유로운 장기 여행',
    },
  ]

  return recommendations.map((rec) => {
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 7) // 일주일 후부터 시작
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + rec.days - 1)

    const preferences: TripPreferences = {
      city,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      adults: onboardingPrefs.adults,
      children: onboardingPrefs.children,
      childAgeGroup: (onboardingPrefs.childAgeGroup as any) || '6to12',
      style: onboardingPrefs.style as any,
      interests: onboardingPrefs.interests || [],
      budget: onboardingPrefs.budget as any,
    }

    return generateItinerary(preferences)
  })
}

