/**
 * 입력 필드 변형 스타일
 * 재사용 가능한 입력 필드 스타일 정의
 */

export const inputVariants = {
  default: {
    base: 'w-full border border-gray-400 bg-white text-base md:text-sm touch-manipulation',
    size: 'h-10 px-4', // 높이 40px (h-10 = 2.5rem = 40px)
    radius: 'rounded-[8px]',
    focus: 'focus:outline-none focus:border-black',
    disabled: 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
  },
  textarea: {
    base: 'w-full border border-gray-400 bg-white text-base md:text-sm touch-manipulation resize-none',
    size: 'min-h-[100px] px-4 py-3',
    radius: 'rounded-[8px]',
    focus: 'focus:outline-none focus:border-black',
    disabled: 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
  },
} as const

/**
 * 입력 필드 클래스 생성 헬퍼
 */
export function getInputClasses(
  variant: 'default' | 'textarea' = 'default',
  disabled: boolean = false
): string {
  const variantStyle = inputVariants[variant]
  const classes = [
    variantStyle.base,
    variantStyle.size,
    variantStyle.radius,
    variantStyle.focus,
    disabled && variantStyle.disabled,
  ].filter(Boolean).join(' ')
  
  return classes
}

