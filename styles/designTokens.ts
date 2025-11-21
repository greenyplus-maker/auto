/**
 * 디자인 토큰 정의
 * 프로젝트 전반에서 사용되는 공통 디자인 값들
 */

export const designTokens = {
  // 색상
  colors: {
    primary: {
      main: 'black',
      hover: 'gray-800',
      active: 'gray-900',
    },
    background: {
      default: 'white',
      secondary: 'gray-50',
      tertiary: 'gray-100',
    },
    text: {
      primary: 'black',
      secondary: 'gray-700',
      tertiary: 'gray-600',
      muted: 'gray-500',
      disabled: 'gray-400',
    },
    border: {
      default: 'gray-300',
      hover: 'gray-400',
      active: 'black',
    },
  },

  // 타이포그래피
  typography: {
    heading: {
      h1: 'text-2xl md:text-3xl lg:text-4xl font-bold leading-tight',
      h2: 'text-xl md:text-2xl lg:text-3xl font-bold leading-tight',
      h3: 'text-lg md:text-xl font-semibold',
      h4: 'text-base md:text-lg font-semibold',
    },
    body: {
      large: 'text-base md:text-lg',
      medium: 'text-sm md:text-base',
      small: 'text-xs md:text-sm',
    },
  },

  // 간격
  spacing: {
    container: {
      padding: 'p-4 md:p-8',
      paddingX: 'px-4 md:px-8',
      paddingY: 'py-4 md:py-8',
    },
    section: {
      marginBottom: 'mb-6 md:mb-8',
      padding: 'p-4 md:p-6',
    },
    element: {
      gap: 'gap-3 md:gap-4',
      marginBottom: 'mb-4 md:mb-6',
    },
  },

  // 보더
  border: {
    default: 'border border-gray-300',
    thick: 'border-2 border-black',
    divider: 'border-b border-gray-300',
  },

  // 버튼 스타일
  button: {
    primary: 'border-2 border-black px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation',
    secondary: 'border border-gray-400 px-4 py-3 md:py-2 text-sm md:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation',
    text: 'text-sm md:text-base text-gray-600 hover:text-black active:text-gray-800 transition-colors touch-manipulation',
    icon: 'p-2 hover:bg-gray-100 transition-colors touch-manipulation',
  },

  // 카드 스타일
  card: {
    default: 'border border-gray-300 p-4 md:p-5',
    interactive: 'border-2 border-gray-300 p-4 md:p-5 hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation',
    selected: 'border-2 border-black bg-black text-white',
  },

  // 입력 필드
  input: {
    default: 'w-full h-10 border border-gray-400 px-4 bg-white text-base md:text-sm rounded-[4px] touch-manipulation focus:outline-none focus:border-black',
    textarea: 'w-full min-h-[100px] border border-gray-400 px-4 py-3 bg-white text-base md:text-sm rounded-[4px] touch-manipulation focus:outline-none focus:border-black resize-none',
    disabled: 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
  },

  // 레이아웃
  layout: {
    container: 'max-w-2xl mx-auto',
    containerLarge: 'max-w-4xl mx-auto',
    containerFull: 'max-w-6xl mx-auto',
    page: 'min-h-screen p-4 md:p-8',
  },
} as const

