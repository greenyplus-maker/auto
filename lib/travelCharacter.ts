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
  tags: string[]
  characterName: string
  features: string
}

export const characterMetadata: Record<CharacterType, CharacterMeta> = {
  PLANNER: {
    name: '디테일 플래너',
    description: '나는 꼼꼼한 스타일이라, 너 여행도 딱 맞게 챙겨줄게!',
    icon: '📋',
    tags: ['#계획왕', '#빈틈없음', '#동선장인', '#하루풀활용', '#정리잘함'],
    characterName: '꼼보',
    features: '정확·정리·계획·효율',
  },
  HEALER: {
    name: '힐링 메이커',
    description: '난 편안한 게 좋아. 너 여행도 여유 있게 만들어줄게.',
    icon: '🌿',
    tags: ['#여유필수', '#호캉스러버', '#조용한곳좋아', '#슬로우트래블', '#편안한여행'],
    characterName: '포노',
    features: '휴식·여유·편안함',
  },
  DISCOVERER: {
    name: '발견가',
    description: '새로운 곳 찾는 거 좋아해! 너 여행도 재밌게 짜줄게.',
    icon: '🧭',
    tags: ['#로컬탐험', '#새로운공간', '#분위기찾기', '#골목여행', '#감성스팟헌터'],
    characterName: '누비',
    features: '탐험·발견·감성스팟',
  },
  FOODIE: {
    name: '미식 러버',
    description: '먹는 거 진짜 중요하지! 맛집 중심으로 일정 짜줄게.',
    icon: '🍜',
    tags: ['#맛집1순위', '#카페투어', '#먹으러가는여행', '#로컬맛', '#식도락러버'],
    characterName: '냠코',
    features: '맛집·카페·미식',
  },
  FAMILY_KEEPER: {
    name: '패밀리 가디언',
    description: '가족이 편해야 진짜 여행이지! 내가 잘 챙겨줄게.',
    icon: '🧸',
    tags: ['#가족중심', '#아이와여행', '#안정적인동선', '#편안한코스', '#따뜻한여행러'],
    characterName: '다솜',
    features: '가족·안정·아이동선',
  },
  ACTIVE: {
    name: '액티브 블루머',
    description: '움직여야 행복하지! 신나는 일정 만들어줄게!',
    icon: '🔥',
    tags: ['#움직여야행복해', '#테마파크러버', '#액티비티매니아', '#활동파여행', '#에너지뿜뿜'],
    characterName: '쑥쑥',
    features: '활동·야외·속도감',
  },
}

interface CharacterCards {
  start: string
  mood: string
  detail: string
}

export const characterCards: Record<CharacterType, CharacterCards> = {
  PLANNER: {
    start: '네가 입력한 도시랑 날짜를 이렇게 정리해놨어!',
    mood: '넌 계획형이라 일정도 딱딱 맞게 구성했어.',
    detail: '세부 조건도 전부 효율적으로 맞춰놨어!',
  },
  HEALER: {
    start: '입력한 정보는 이렇게 편하게 묶어뒀어.',
    mood: '너 힐링 스타일이라 일정도 여유롭게 잡았어.',
    detail: '무리 없도록 쉬는 코스 위주로 넣어놨어.',
  },
  DISCOVERER: {
    start: '입력한 정보는 이렇게 깔끔히 정리했어!',
    mood: '너는 탐험러니까 로컬 중심으로 방향 잡았어.',
    detail: '감성 스팟들을 일정에 골고루 섞어놨어!',
  },
  FOODIE: {
    start: '네 정보는 이렇게 요약했어. 맛집짜기 좋더라!',
    mood: '넌 미식러니까 일정 축은 맛집으로 잡았어.',
    detail: '로컬 맛집이랑 카페로 꽉 채워놨어!',
  },
  FAMILY_KEEPER: {
    start: '가족 정보는 이렇게 안정적으로 정리했어!',
    mood: '가족 여행이라 무리 없는 코스로 잡았어.',
    detail: '아이·어른 다 편한 동선으로 채워놨어.',
  },
  ACTIVE: {
    start: '도시랑 날짜 다 정리해놨어! 이제 출발만 하면 돼!',
    mood: '너 활동형이라 테마파크·야외 위주로 잡았어.',
    detail: '액티비티 중심으로 일정 꽉꽉 넣어놨어!',
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

