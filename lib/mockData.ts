import type { Place, PlaceCategory } from '@/types'

export const mockPlaces: Record<string, Place[]> = {
  tokyo: [
    {
      id: 'tokyo-1',
      name: '시부야 스크램블 교차로',
      category: 'other',
      area: '시부야',
      description: '세계에서 가장 유명한 교차로 중 하나로, 수많은 사람들이 동시에 건너는 장관을 볼 수 있습니다.',
    },
    {
      id: 'tokyo-2',
      name: '하라주쿠 타케시타 거리',
      category: 'shopping',
      area: '하라주쿠',
      description: '일본 젊은이들의 문화를 체험할 수 있는 번화가로, 독특한 패션과 음식을 즐길 수 있습니다.',
    },
    {
      id: 'tokyo-3',
      name: '센소지',
      category: 'museum',
      area: '아사쿠사',
      description: '도쿄에서 가장 오래된 절로, 전통적인 일본 문화를 경험할 수 있는 곳입니다.',
    },
    {
      id: 'tokyo-4',
      name: '츠타야 서점',
      category: 'shopping',
      area: '다이칸야마',
      description: '세계에서 가장 아름다운 서점 중 하나로, 독서와 문화 공간을 동시에 즐길 수 있습니다.',
    },
    {
      id: 'tokyo-5',
      name: '오모테산도 힐스',
      category: 'shopping',
      area: '오모테산도',
      description: '고급 브랜드와 독특한 건축물이 어우러진 쇼핑 거리입니다.',
    },
    {
      id: 'tokyo-6',
      name: '우에노 공원',
      category: 'nature',
      area: '우에노',
      description: '봄에는 벚꽃으로 유명한 대형 공원으로, 박물관과 동물원도 함께 있습니다.',
    },
    {
      id: 'tokyo-7',
      name: '스타벅스 리저브 로스터리',
      category: 'cafe',
      area: '나카메구로',
      description: '세계 최대 규모의 스타벅스 리저브 로스터리로, 특별한 커피 경험을 제공합니다.',
    },
    {
      id: 'tokyo-8',
      name: '스시 사와',
      category: 'restaurant',
      area: '긴자',
      description: '미쉐린 가이드에 선정된 전통 스시집으로, 최고급 재료를 맛볼 수 있습니다.',
    },
    {
      id: 'tokyo-9',
      name: '도쿄 스카이트리',
      category: 'other',
      area: '스미다',
      description: '도쿄의 랜드마크 타워로, 전망대에서 도시 전경을 감상할 수 있습니다.',
    },
    {
      id: 'tokyo-10',
      name: '도쿄 디즈니랜드',
      category: 'themePark',
      area: '우라야스',
      description: '세계에서 가장 인기 있는 테마파크 중 하나로, 가족 모두가 즐길 수 있습니다.',
    },
  ],
  osaka: [
    {
      id: 'osaka-1',
      name: '오사카 성',
      category: 'museum',
      area: '오사카',
      description: '일본의 대표적인 성 중 하나로, 역사와 아름다운 건축을 감상할 수 있습니다.',
    },
    {
      id: 'osaka-2',
      name: '도톤보리',
      category: 'other',
      area: '난바',
      description: '오사카의 대표적인 번화가로, 네온사인과 맛집이 가득한 거리입니다.',
    },
    {
      id: 'osaka-3',
      name: '우메다 스카이 빌딩',
      category: 'other',
      area: '우메다',
      description: '공중정원에서 오사카 시내를 한눈에 볼 수 있는 전망대입니다.',
    },
    {
      id: 'osaka-4',
      name: '신사이바시',
      category: 'shopping',
      area: '신사이바시',
      description: '오사카의 대표 쇼핑 거리로, 다양한 상점과 레스토랑이 있습니다.',
    },
    {
      id: 'osaka-5',
      name: '타코야키 무코무라',
      category: 'restaurant',
      area: '도톤보리',
      description: '오사카의 대표 음식 타코야키를 맛볼 수 있는 유명 식당입니다.',
    },
  ],
  kyoto: [
    {
      id: 'kyoto-1',
      name: '후시미 이나리 신사',
      category: 'other',
      area: '후시미',
      description: '수천 개의 주황색 토리이로 유명한 신사로, 일본의 대표적인 관광지입니다.',
    },
    {
      id: 'kyoto-2',
      name: '기요미즈데라',
      category: 'museum',
      area: '히가시야마',
      description: '유네스코 세계문화유산으로 지정된 절로, 아름다운 전통 건축을 볼 수 있습니다.',
    },
    {
      id: 'kyoto-3',
      name: '아라시야마',
      category: 'nature',
      area: '아라시야마',
      description: '대나무 숲과 전통 마을이 어우러진 아름다운 자연 경관을 즐길 수 있습니다.',
    },
    {
      id: 'kyoto-4',
      name: '긴카쿠지',
      category: 'museum',
      area: '기타',
      description: '금각사로 불리는 유명한 절로, 정원과 건축이 조화를 이룹니다.',
    },
    {
      id: 'kyoto-5',
      name: '기온 거리',
      category: 'shopping',
      area: '기온',
      description: '전통 기와집과 현대 상점이 공존하는 역사적인 거리입니다.',
    },
  ],
  fukuoka: [
    {
      id: 'fukuoka-1',
      name: '하카타 라멘',
      category: 'restaurant',
      area: '하카타',
      description: '후쿠오카의 대표 음식인 돈코츠 라멘을 맛볼 수 있는 식당입니다.',
    },
    {
      id: 'fukuoka-2',
      name: '오호리 공원',
      category: 'nature',
      area: '주오',
      description: '도심 속 호수를 중심으로 한 아름다운 공원입니다.',
    },
    {
      id: 'fukuoka-3',
      name: '후쿠오카 타워',
      category: 'other',
      area: '모모치',
      description: '후쿠오카의 랜드마크 타워로, 야경이 특히 아름답습니다.',
    },
  ],
}

export function getPlacesByCity(city: string): Place[] {
  const cityKey = city.toLowerCase()
  if (cityKey.includes('tokyo') || cityKey.includes('도쿄') || cityKey.includes('동경')) {
    return mockPlaces.tokyo
  } else if (cityKey.includes('osaka') || cityKey.includes('오사카') || cityKey.includes('대판')) {
    return mockPlaces.osaka
  } else if (cityKey.includes('kyoto') || cityKey.includes('교토') || cityKey.includes('경도')) {
    return mockPlaces.kyoto
  } else if (cityKey.includes('fukuoka') || cityKey.includes('후쿠오카') || cityKey.includes('복강')) {
    return mockPlaces.fukuoka
  }
  // 기본값으로 도쿄 장소 반환
  return mockPlaces.tokyo
}

export function getPlacesByCategory(places: Place[], category: string): Place[] {
  return places.filter((place) => place.category === category)
}

export function getPlacesByInterests(places: Place[], interests: string[]): Place[] {
  if (interests.length === 0) return places
  return places.filter((place) => interests.includes(place.category))
}

