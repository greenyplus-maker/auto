import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 커스텀 색상
      colors: {
        // 모노크롬 디자인을 위한 그레이스케일
        mono: {
          black: '#000000',
          'gray-900': '#1a1a1a',
          'gray-800': '#333333',
          'gray-700': '#4d4d4d',
          'gray-600': '#666666',
          'gray-500': '#808080',
          'gray-400': '#999999',
          'gray-300': '#cccccc',
          'gray-200': '#e6e6e6',
          'gray-100': '#f3f3f3',
          'gray-50': '#fafafa',
          white: '#ffffff',
        },
      },
      // 커스텀 간격
      spacing: {
        'container-padding': '1rem', // 16px
        'container-padding-md': '2rem', // 32px
        'section-gap': '1.5rem', // 24px
        'section-gap-md': '2rem', // 32px
      },
      // 커스텀 최대 너비
      maxWidth: {
        'container': '42rem', // 672px (max-w-2xl)
        'container-lg': '56rem', // 896px (max-w-4xl)
        'container-xl': '72rem', // 1152px (max-w-6xl)
        'onboarding': '600px',
      },
      // 커스텀 border radius
      borderRadius: {
        'input': '4px',
      },
    },
  },
  plugins: [],
}
export default config

