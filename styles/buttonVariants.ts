/**
 * 버튼 변형 스타일
 * 재사용 가능한 버튼 스타일 정의
 */

import { designTokens } from './designTokens'

export const buttonVariants = {
  primary: {
    base: 'w-full text-center border-2 border-black font-medium transition-colors touch-manipulation rounded-[8px]',
    sizes: {
      large: 'px-6 py-4 md:px-8 md:py-3 text-base md:text-lg',
      medium: 'px-4 py-3 md:px-6 md:py-2 text-sm md:text-base',
      small: 'px-3 py-2 text-sm',
    },
    states: {
      default: 'hover:bg-black hover:text-white',
      active: 'active:bg-gray-800',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  secondary: {
    base: 'border border-gray-400 font-medium transition-colors touch-manipulation rounded-[8px]',
    sizes: {
      large: 'px-6 py-4 md:px-8 md:py-3 text-base md:text-lg',
      medium: 'px-4 py-3 md:px-6 md:py-2 text-sm md:text-base',
      small: 'px-3 py-2 text-sm',
    },
    states: {
      default: 'hover:bg-gray-100',
      active: 'active:bg-gray-200',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  text: {
    base: 'text-gray-600 font-medium transition-colors touch-manipulation rounded-[8px]',
    sizes: {
      large: 'px-4 py-3 text-base',
      medium: 'px-3 py-2 text-sm',
      small: 'px-2 py-1 text-xs',
    },
    states: {
      default: 'hover:text-black',
      active: 'active:text-gray-800',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
} as const

/**
 * 버튼 클래스 생성 헬퍼
 */
export function getButtonClasses(
  variant: 'primary' | 'secondary' | 'text',
  size: 'large' | 'medium' | 'small' = 'medium',
  disabled: boolean = false
): string {
  const variantStyle = buttonVariants[variant]
  const classes = [
    variantStyle.base,
    variantStyle.sizes[size],
    disabled ? variantStyle.states.disabled : variantStyle.states.default,
    !disabled && variantStyle.states.active,
  ].filter(Boolean).join(' ')
  
  return classes
}

