/**
 * 타이포그래피 스타일
 * 재사용 가능한 텍스트 스타일 정의
 */

import { designTokens } from './designTokens'

export const typography = {
  // 제목
  h1: designTokens.typography.heading.h1,
  h2: designTokens.typography.heading.h2,
  h3: designTokens.typography.heading.h3,
  h4: designTokens.typography.heading.h4,
  
  // 본문
  bodyLarge: designTokens.typography.body.large,
  bodyMedium: designTokens.typography.body.medium,
  bodySmall: designTokens.typography.body.small,
  
  // 특수 용도
  label: 'text-sm md:text-base font-medium',
  caption: 'text-xs md:text-sm text-gray-500',
  link: 'text-sm md:text-base text-gray-600 hover:text-black transition-colors',
} as const

