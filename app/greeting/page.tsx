'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'

export default function GreetingPage() {
  const router = useRouter()
  const { resetOnboarding } = useItineraryStore()
  const [isLoginMode, setIsLoginMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleStartOnboarding = () => {
    resetOnboarding()
    router.push('/main')
  }

  const handleGoToMain = () => {
    router.push('/main')
  }

  const handleGuestMode = () => {
    // 게스트 모드로 진행 - 홈으로 이동
    router.push('/main')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: 로그인 로직 구현
    // 현재는 임시로 홈으로 이동
    setTimeout(() => {
      setIsLoading(false)
      router.push('/main')
    }, 500)
  }

  const handleSignUp = () => {
    // TODO: 회원가입 페이지로 이동
    // router.push('/signup')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[16px] p-6 md:p-8 shadow-sm border border-gray-200">
          {/* 헤더 */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              일본 여행 일정 자동 생성기
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {isLoginMode ? '로그인하여 시작하세요' : '환영합니다'}
            </p>
          </div>

          {/* 로그인 폼 (나중에 활성화) */}
          {isLoginMode ? (
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white px-6 py-3 md:py-2 text-base md:text-sm font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  회원가입
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className="w-full text-center border border-gray-400 px-6 py-3 md:py-2 text-sm md:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation text-gray-600 rounded-[8px]"
                >
                  뒤로가기
                </button>
              </div>
            </form>
          ) : (
            /* 그리팅 메시지 및 액션 버튼 */
            <div className="space-y-4 md:space-y-5">
              <div className="text-center py-4">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                  맞춤형 일본 여행 일정을 자동으로 생성해드립니다.
                  <br />
                  도시, 날짜, 여행 스타일을 바탕으로 최적의 일정을 제안합니다.
                </p>
              </div>

              {/* 온보딩 시작하기 버튼 */}
              <button
                onClick={handleStartOnboarding}
                className="w-full bg-black text-white px-6 py-3 md:py-2 text-base md:text-sm font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation rounded-[8px]"
              >
                온보딩 시작하기
              </button>

              {/* 메인으로 가기 버튼 */}
              <button
                onClick={handleGoToMain}
                className="w-full text-center border border-gray-400 px-6 py-3 md:py-2 text-sm md:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation text-gray-600 rounded-[8px]"
              >
                메인으로 가기
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

