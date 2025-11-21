/**
 * 카드 변형 스타일
 * 재사용 가능한 카드 스타일 정의
 */

export const cardVariants = {
  default: 'border border-gray-300 p-4 md:p-5',
  interactive: 'border-2 border-gray-300 p-4 md:p-5 hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation',
  selected: 'border-2 border-black bg-black text-white',
  outlined: 'border-2 border-gray-300 bg-white',
  filled: 'border border-gray-300 bg-gray-50 p-4 md:p-6',
} as const

/**
 * 카드 클래스 생성 헬퍼
 */
export function getCardClasses(
  variant: keyof typeof cardVariants,
  additionalClasses?: string
): string {
  return [cardVariants[variant], additionalClasses].filter(Boolean).join(' ')
}

