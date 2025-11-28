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
  hashtags: string[]
}

export const characterMetadata: Record<CharacterType, CharacterMeta> = {
  PLANNER: {
    name: '디테일 플래너',
    description: '여행은 스케줄링부터 시작! 계획표가 딱딱 맞아떨어질 때 가장 뿌듯한 타입.',
    icon: '🗂️',
    hashtags: ['#계획왕', '#빈틈없음', '#동선장인', '#하루풀활용', '#정리잘함'],
  },
  HEALER: {
    name: '힐링 메이커',
    description: '“쉬려고 왔는데 왜 뛰어?” 여유·힐링·호캉스를 가장 사랑하는 부드러운 여행러.',
    icon: '🌿',
    hashtags: ['#여유필수', '#호캉스러버', '#조용한곳좋아', '#슬로우트래블', '#편안한여행'],
  },
  DISCOVERER: {
    name: '발견가',
    description: '지도에 없는 골목, 처음 보는 가게… 새로운 분위기를 향해 자연스럽게 발길이 가는 탐험러.',
    icon: '🧭',
    hashtags: ['#로컬탐험', '#새로운공간', '#분위기찾기', '#골목여행', '#감성스팟헌터'],
  },
  FOODIE: {
    name: '미식 러버',
    description: '일정의 중심은 맛집부터! 한 끼 잘 먹으면 여행이 이미 완성이라고 생각하는 타입.',
    icon: '🍣',
    hashtags: ['#맛집1순위', '#카페투어', '#먹으러가는여행', '#로컬맛', '#식도락러버'],
  },
  FAMILY_KEEPER: {
    name: '패밀리 가디언',
    description: "내 여행의 기준은 ‘우리 가족이 편한가?’ 모두가 즐겁고 무리 없는 일정이 좋은 따뜻한 여행러.",
    icon: '👨‍👩‍👧‍👦',
    hashtags: ['#가족중심', '#아이와여행', '#안정적인동선', '#편안한코스', '#따뜻한여행러'],
  },
  ACTIVE: {
    name: '액티브 블루머',
    description: '하루 종일 돌아다녀도 에너지 풀충전! 테마파크·액티비티·야외 스폿에 진심인 활동파.',
    icon: '🎢',
    hashtags: ['#움직여야행복해', '#테마파크러버', '#액티비티매니아', '#활동파여행', '#에너지뿜뿜'],
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

