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
  summary: string
  icon: string
  tags: string[]
  characterName: string
  features: string
  recommendedTripMessages: {
    day3: string
    day5: string
    day7: string
  }
}

export const characterMetadata: Record<CharacterType, CharacterMeta> = {
  PLANNER: {
    name: '디테일 플래너',
    description: '네 여행 스타일대로, 내가 딱 맞게 챙겨봤어!',
    summary: '네가 알려준 걸로, 딱 네 스타일 나오게 잘 챙겨놨어!',
    icon: '📋',
    tags: ['#계획왕', '#빈틈없음', '#동선장인', '#하루풀활용', '#정리잘함'],
    characterName: '꼼보',
    features: '정확·정리·계획·효율',
    recommendedTripMessages: {
      day3: '2박 3일이면 빠듯하지만 알차게! 이렇게 돌면 딱 좋아.',
      day5: '4박 5일은 여유도 살짝 챙기면서 알차게 갈 수 있어!',
      day7: '7박 8일은 네 스타일대로 완전 완벽하게 돌아볼 수 있어!',
    },
  },
  HEALER: {
    name: '힐링 메이커',
    description: '너 여행은 내가 편하게 만들어놨어. 너무 무리하지 말자~',
    summary: '너 준 정보 보면서, 편하게 쉬기 좋게 살짝 정리해봤어.',
    icon: '🌿',
    tags: ['#여유필수', '#호캉스러버', '#조용한곳좋아', '#슬로우트래블', '#편안한여행'],
    characterName: '포노',
    features: '휴식·여유·포근함',
    recommendedTripMessages: {
      day3: '2박 3일은 가볍게! 이렇게만 돌아도 충분해.',
      day5: '4박 5일이면 더 여유롭게 즐길 수 있어. 쉬는 타임 넣어놨어!',
      day7: '7박 8일은 완전 힐링 코스로 갈 수 있지. 진짜 부드럽게 짜봤어.',
    },
  },
  DISCOVERER: {
    name: '발견가',
    description: '새로운 거 좋아하는 너한테 딱 맞게 재미있게 짜봤어!',
    summary: '네 정보 보고, 너가 좋아할 만한 데들 쏙쏙 넣어놨어!',
    icon: '🧭',
    tags: ['#로컬탐험', '#새로운공간', '#분위기찾기', '#골목여행', '#감성스팟헌터'],
    characterName: '누비',
    features: '탐험·발견·감성',
    recommendedTripMessages: {
      day3: '2박 3일은 핵심 스팟 위주로 이렇게만 돌아도 재밌어!',
      day5: '4박 5일은 골목골목 더 깊게 누빌 수 있어서 좋아!',
      day7: '7박 8일은 진짜 탐험 제대로지! 숨은 스팟 많이 넣어놨어.',
    },
  },
  FOODIE: {
    name: '미식 러버',
    description: '맛있는 여행은 내가 자신 있지! 너 취향대로 챙겨놨어.',
    summary:
      '네가 말한 거 보니까, 너 좋아할 맛있는 곳들 위주로 챙겨봤어!',
    icon: '🍜',
    tags: ['#맛집1순위', '#카페투어', '#먹으러가는여행', '#로컬맛', '#식도락러버'],
    characterName: '냠코',
    features: '맛집·카페·미식',
    recommendedTripMessages: {
      day3: '2박 3일은 핵심 맛집만 골라서 이렇게 가면 돼!',
      day5: '4박 5일은 카페까지 다양하게 즐길 수 있게 넣어봤어!',
      day7: '7박 8일은 진짜 미식 여행이지. 너 좋아할 데 꽉 담았어!',
    },
  },
  FAMILY_KEEPER: {
    name: '패밀리 가디언',
    description: '가족이랑 가는 여행이라면 내가 잘 챙겨줄게!',
    summary:
      '너가 준 가족 정보 보고, 다들 편하게 다닐 수 있게 만들어놨어!',
    icon: '🧸',
    tags: ['#가족중심', '#아이와여행', '#안정적인동선', '#편안한코스', '#따뜻한여행러'],
    characterName: '다솜',
    features: '가족·안정·아이동선',
    recommendedTripMessages: {
      day3: '2박 3일은 무리 없게 이렇게만 가도 충분히 좋아!',
      day5: '4박 5일은 쉬는 시간도 챙기면서 갈 수 있게 해놨어.',
      day7: '7박 8일은 여유롭게 다니기 딱 좋아. 부드럽게 짜봤어!',
    },
  },
  ACTIVE: {
    name: '액티브 블루머',
    description: '신나게 놀 준비 됐지? 너답게 만들어봤어!',
    summary:
      '네 정보 보니까 딱 신나게 놀면 좋겠다 싶어서 그렇게 만들어봤어!',
    icon: '🔥',
    tags: ['#움직여야행복해', '#테마파크러버', '#액티비티매니아', '#활동파여행', '#에너지뿜뿜'],
    characterName: '쑥쑥',
    features: '활동·액티비티·야외',
    recommendedTripMessages: {
      day3: '2박 3일은 빠르게 놀아야지! 이렇게 가면 딱 신나.',
      day5: '4박 5일은 액티비티 더 넣을 수 있어서 좋더라!',
      day7: '7박 8일은 진짜 본격 액티브 코스지! 재밌게 꽉 채웠어.',
    },
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

