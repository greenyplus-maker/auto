'use client'

import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="border-b border-gray-300 pb-6 md:pb-8 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight">오류가 발생했습니다</h1>
          <p className="text-sm md:text-base text-gray-700">
            일정을 생성하는 중 문제가 발생했습니다.
          </p>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          <p className="text-sm md:text-base text-gray-600">
            다시 시도해주세요.
          </p>
          
          <Link
            href="/plan/new"
            className="inline-block w-full md:w-auto border-2 border-black px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation"
          >
            다시 시도하기
          </Link>
        </div>
      </div>
    </main>
  )
}

