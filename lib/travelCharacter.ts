import type {
  TravelStyle,
  Budget,
  ChildAgeGroup,
  TravelGroupType,
} from '@/types'

export type CharacterType =
  | 'PLANNER'
  | 'HEALER'
  | 'DISCOVERER'
  | 'FOODIE'
  | 'FAMILY_KEEPER'
  | 'ACTIVE'

export interface OnboardingAnswers {
  style?: TravelStyle | null
  interests?: string[]
  budget?: Budget | null
  adults?: number
  children?: number
  childAgeGroups?: ChildAgeGroup[] | null
  groupType?: TravelGroupType | null
  city?: string | null
}

interface CharacterMeta {
  name: string
  description: string
  icon: string
}

export const characterMetadata: Record<CharacterType, CharacterMeta> = {
  PLANNER: {
    name: '디테일 플래너',
    description: '빈틈없는 일정과 계획을 즐기는 타입',
    icon: '🗂️',
  },
  HEALER: {
    name: '힐링 메이커',
    description: '여유로운 호캉스와 자연을 사랑하는 타입',
    icon: '🌿',
  },
  DISCOVERER: {
    name: '발견가',
    description: '새로운 경험과 숨은 명소를 찾는 타입',
    icon: '🧭',
  },
  FOODIE: {
    name: '미식가',
    description: '맛집 탐방과 카페 체험을 즐기는 타입',
    icon: '🍣',
  },
  FAMILY_KEEPER: {
    name: '패밀리 케어러',
    description: '가족 구성원의 만족을 최우선으로 챙기는 타입',
    icon: '👨‍👩‍👧‍👦',
  },
  ACTIVE: {
    name: '액티브 러버',
    description: '테마파크와 야외 활동을 좋아하는 활동가',
    icon: '🎢',
  },
}

const interestWeights: Record<
  string,
  Partial<Record<CharacterType, number>>
> = {
  cafe: { FOODIE: 2, HEALER: 1 },
  restaurant: { FOODIE: 3 },
  shopping: { PLANNER: 2, DISCOVERER: 1 },
  museum: { PLANNER: 2, DISCOVERER: 1 },
  themePark: { ACTIVE: 3, FAMILY_KEEPER: 1 },
  nature: { HEALER: 2, ACTIVE: 1 },
}

const cityWeights: Record<string, Partial<Record<CharacterType, number>>> = {
  도쿄: { PLANNER: 1, FOODIE: 1 },
  오사카: { FOODIE: 2, ACTIVE: 1 },
  교토: { PLANNER: 1, DISCOVERER: 2 },
  후쿠오카: { FOODIE: 1, DISCOVERER: 1 },
  홋카이도: { HEALER: 2, ACTIVE: 1 },
  오키나와: { HEALER: 3 },
  다카마쓰: { DISCOVERER: 2 },
  '아직 정하지 않음': { DISCOVERER: 1 },
}

const groupWeights: Record<
  Exclude<TravelGroupType, '' | 'couple' | 'kids'>,
  Partial<Record<CharacterType, number>>
> = {
  family: { FAMILY_KEEPER: 3, HEALER: 1 },
  lovers: { HEALER: 2 },
  friends: { ACTIVE: 2, DISCOVERER: 1 },
  parents: { FAMILY_KEEPER: 2, HEALER: 1 },
}

const priorityOrder: CharacterType[] = [
  'PLANNER',
  'FOODIE',
  'HEALER',
  'DISCOVERER',
  'FAMILY_KEEPER',
  'ACTIVE',
]

export function decideCharacter(answers: OnboardingAnswers): CharacterType {
  const scores: Record<CharacterType, number> = {
    PLANNER: 0,
    HEALER: 0,
    DISCOVERER: 0,
    FOODIE: 0,
    FAMILY_KEEPER: 0,
    ACTIVE: 0,
  }

  const { style, interests = [], budget, groupType, adults, children, city } =
    answers

  if (style === 'intensive') {
    scores.PLANNER += 3
    scores.ACTIVE += 1
  } else if (style === 'relaxed') {
    scores.HEALER += 2
    scores.FAMILY_KEEPER += 1
  } else if (style === 'normal') {
    scores.DISCOVERER += 1
  }

  if (interests.length === 0) {
    scores.DISCOVERER += 2
  } else {
    interests.forEach((interest) => {
      const mapping = interestWeights[interest]
      if (!mapping) return
      Object.entries(mapping).forEach(([character, weight]) => {
        scores[character as CharacterType] += weight || 0
      })
    })
  }

  if (budget === 'high') {
    scores.PLANNER += 1
    scores.FOODIE += 2
  } else if (budget === 'low') {
    scores.DISCOVERER += 2
  } else if (budget === 'medium') {
    scores.PLANNER += 1
  }

  if (groupType && groupType in groupWeights) {
    Object.entries(groupWeights[groupType as keyof typeof groupWeights]).forEach(
      ([character, weight]) => {
        scores[character as CharacterType] += weight || 0
      },
    )
  }

  if ((children || 0) > 0) {
    scores.FAMILY_KEEPER += 3
    scores.HEALER += 1
    scores.ACTIVE += 1
  }

  if ((adults || 0) >= 4 && (groupType === 'friends' || groupType === 'family')) {
    scores.ACTIVE += 2
  }

  if (city && cityWeights[city]) {
    Object.entries(cityWeights[city]).forEach(([character, weight]) => {
      scores[character as CharacterType] += weight || 0
    })
  }

  const best = Object.entries(scores).reduce(
    (currentBest, [character, score]) => {
      if (score > currentBest.score) {
        return { character: character as CharacterType, score }
      }

      if (score === currentBest.score) {
        const currentPriority = priorityOrder.indexOf(
          character as CharacterType,
        )
        const bestPriority = priorityOrder.indexOf(currentBest.character)
        if (currentPriority < bestPriority) {
          return { character: character as CharacterType, score }
        }
      }
      return currentBest
    },
    { character: 'PLANNER' as CharacterType, score: Number.NEGATIVE_INFINITY },
  )

  return best.character
}

