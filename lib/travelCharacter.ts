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
    description: '여행은 스케줄링부터 시작! 계획표가 딱딱 맞아떨어질 때 가장 뿌듯한 타입.',
    icon: '📋',
    tags: ['#계획왕', '#빈틈없음', '#동선장인', '#하루풀활용', '#정리잘함'],
    characterName: '꼼보',
    features: '정확·정리·계획·꼼꼼함',
  },
  HEALER: {
    name: '힐링 메이커',
    description: '"쉬려고 왔는데 왜 뛰어?" 여유·힐링·호캉스를 가장 사랑하는 부드러운 여행러.',
    icon: '🌿',
    tags: ['#여유필수', '#호캉스러버', '#조용한곳좋아', '#슬로우트래블', '#편안한여행'],
    characterName: '포노',
    features: '포근함·휴식·힐링·조용한 무드',
  },
  DISCOVERER: {
    name: '발견가',
    description: '지도에 없는 골목, 처음 보는 가게… 새로운 분위기를 향해 자연스럽게 발길이 가는 탐험러.',
    icon: '🧭',
    tags: ['#로컬탐험', '#새로운공간', '#분위기찾기', '#골목여행', '#감성스팟헌터'],
    characterName: '누비',
    features: '탐험·발견·로컬·새로운 경험',
  },
  FOODIE: {
    name: '미식 러버',
    description: '일정의 중심은 맛집부터! 한 끼 잘 먹으면 여행이 이미 완성이라고 생각하는 타입.',
    icon: '🍜',
    tags: ['#맛집1순위', '#카페투어', '#먹으러가는여행', '#로컬맛', '#식도락러버'],
    characterName: '냠코',
    features: '맛집·카페·먹거리 중심 여행',
  },
  FAMILY_KEEPER: {
    name: '패밀리 가디언',
    description: "내 여행의 기준은 '우리 가족이 편한가?' 모두가 즐겁고 무리 없는 일정이 좋은 따뜻한 여행러.",
    icon: '🧸',
    tags: ['#가족중심', '#아이와여행', '#안정적인동선', '#편안한코스', '#따뜻한여행러'],
    characterName: '다솜',
    features: '가족·안정·아이동선·따뜻함',
  },
  ACTIVE: {
    name: '액티브 블루머',
    description: '하루 종일 돌아다녀도 에너지 풀충전! 테마파크·액티비티·야외 스폿에 진심인 활동파.',
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
    start: '기본 정보는 이렇게 깔끔하게 준비됐어요!',
    mood: '여행 분위기도 계획대로 딱 맞게 정리해뒀어요.',
    detail: '동선·조건·우선순서까지 꼼꼼하게 들어가 있어요.',
  },
  HEALER: {
    start: '천천히, 편안하게 떠날 준비가 되어 있어요.',
    mood: '여행 무드는 여유롭고 부드러운 편이에요.',
    detail: '편안한 이동과 무리 없는 옵션들만 모아뒀어요.',
  },
  DISCOVERER: {
    start: '출발 정보는 준비 끝! 이제 새로운 공간들을 찾아가볼까요?',
    mood: "여행 무드는 ‘발견’과 ‘분위기 탐험’에 초점이 맞춰져 있어요.",
    detail: '로컬 분위기와 색다른 스팟 중심으로 조건이 채워져 있어요.',
  },
  FOODIE: {
    start: '기본 여행 정보는 준비됐어요. 이제 맛있는 여정만 남았어요!',
    mood: "여행 스타일은 ‘맛집 중심’으로 설정돼 있어요.",
    detail: '로컬 맛집·카페 같은 디테일들이 잘 담겨 있어요.',
  },
  FAMILY_KEEPER: {
    start: '모두가 편한 출발 준비가 되어 있어요.',
    mood: '여행 분위기는 안정적이고 가족 친화적이에요.',
    detail: '아이 동선·편안한 코스·휴식 중심 옵션이 들어 있어요.',
  },
  ACTIVE: {
    start: '기본 정보는 완료! 전력질주 여행 준비됐어요!',
    mood: '여행 무드는 에너지 가득한 액티비티 중심이에요.',
    detail: '테마파크·야외·활동 중심 조건들이 꽉 차 있어요.',
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

