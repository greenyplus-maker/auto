'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="border-b border-gray-300 pb-6 md:pb-8 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            일본 여행 일정 자동 생성기
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
            여행 조건을 입력하시면 맞춤형 일본 여행 일정을 자동으로 생성해드립니다.
            도시, 날짜, 여행 스타일, 관심사 등을 바탕으로 최적의 일정을 제안합니다.
          </p>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          <p className="text-sm md:text-base text-gray-600">
            간단한 몇 가지 질문에 답하시면 됩니다.
          </p>
          
          <Link
            href="/plan/new"
            className="block w-full text-center border-2 border-black px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation"
          >
            일정 만들기 시작하기
          </Link>
        </div>
      </div>
    </main>
  )
}

