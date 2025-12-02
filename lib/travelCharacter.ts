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
    description: '나는 꼼꼼한 스타일이라, 너 여행 갈 때도 빈틈없이 딱 맞게 챙겨줄게!',
    icon: '📋',
    tags: ['#계획왕', '#빈틈없음', '#동선장인', '#하루풀활용', '#정리잘함'],
    characterName: '꼼보',
    features: '정확·정리·계획·꼼꼼함',
  },
  HEALER: {
    name: '힐링 메이커',
    description: '난 편안한 게 제일 좋아. 너 여행도 무리 없고 여유 있게 만들어줄게.',
    icon: '🌿',
    tags: ['#여유필수', '#호캉스러버', '#조용한곳좋아', '#슬로우트래블', '#편안한여행'],
    characterName: '포노',
    features: '포근함·휴식·힐링·조용한 무드',
  },
  DISCOVERER: {
    name: '발견가',
    description: '난 새로운 곳 찾아다니는 거 좋아하거든! 너 여행도 감성 스팟 위주로 재밌게 짜줄게.',
    icon: '🧭',
    tags: ['#로컬탐험', '#새로운공간', '#분위기찾기', '#골목여행', '#감성스팟헌터'],
    characterName: '누비',
    features: '탐험·발견·로컬·새로운 경험',
  },
  FOODIE: {
    name: '미식 러버',
    description: '나는 먹는 게 진짜 중요해! 맛집부터 딱딱 골라서 너 일정 채워줄게.',
    icon: '🍜',
    tags: ['#맛집1순위', '#카페투어', '#먹으러가는여행', '#로컬맛', '#식도락러버'],
    characterName: '냠코',
    features: '맛집·카페·먹거리 중심 여행',
  },
  FAMILY_KEEPER: {
    name: '패밀리 가디언',
    description: '난 모두가 편해야 마음이 놓여. 너 여행도 가족 다 편한 코스로 챙겨줄게.',
    icon: '🧸',
    tags: ['#가족중심', '#아이와여행', '#안정적인동선', '#편안한코스', '#따뜻한여행러'],
    characterName: '다솜',
    features: '가족·안정·아이동선·따뜻함',
  },
  ACTIVE: {
    name: '액티브 블루머',
    description: '난 움직여야 행복해! 너 일정도 신나게 뛰어다니는 스타일로 만들어줄게!',
    icon: '🔥',
    tags: ['#움직여야행복해', '#테마파크러버', '#액티비티매니아', '#활동파여행', '#에너지뿜뿜'],
    characterName: '쑥쑥',
    features: '활동·속도감·테마파크·야외',
  },
}

interface CharacterCards {
  start: string
  mood: string
  detail: string
}

export const characterCards: Record<CharacterType, CharacterCards> = {
  PLANNER: {
    start: '기본 정보는 내가 깔끔하게 정리해놨어!',
    mood: '너가 고른 스타일, 이렇게 정리해뒀어!',
    detail: '디테일까지 완전 효율적으로 딱 맞춰놨어!',
  },
  HEALER: {
    start: '출발 준비는 편안하게 끝났어. 천천히 가자!',
    mood: '이번 여행 무드… 진짜 여유롭고 좋다~',
    detail: '너무 바쁘지 않게, 마음 편한 디테일들로 채웠어.',
  },
  DISCOVERER: {
    start: '기본 세팅 끝! 이제 진짜 재밌는 거 시작해볼까?',
    mood: '이번 무드는 발견 모드지! 재밌는 곳들 많아.',
    detail: '감성 있는 로컬 스팟들을 여기저기 넣어놨지!',
  },
  FOODIE: {
    start: '출발 정보는 준비 완료! 이제 맛집 채울 차례야!',
    mood: '맛있게 먹는 여행, 딱 너한테 맞게 만들어놨어!',
    detail: '맛집·카페는 내가 다 챙겼지~ 걱정 ㄴㄴ!',
  },
  FAMILY_KEEPER: {
    start: '가족 모두 편하게 출발할 준비 해뒀어.',
    mood: '가족 다 편한 분위기로 만들어놨어.',
    detail: '아이도 어른도 편한 동선으로 정리해뒀어.',
  },
  ACTIVE: {
    start: '기본 세팅 완전 OK! 이제 신나게 달려보자!',
    mood: '이번 여행 무드는 에너지 풀충전! 완전 내 스타일이지?',
    detail: '액티비티·테마파크 중심으로 꽉꽉 넣어놨어!',
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

