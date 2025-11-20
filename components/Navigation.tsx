'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useItineraryStore } from '@/store/itineraryStore'

interface NavItem {
  href: string
  label: string
  showWhen?: 'always' | 'hasItinerary' | 'noItinerary'
}

const navItems: NavItem[] = [
  { href: '/', label: '홈', showWhen: 'always' },
  { href: '/plan/new', label: '새 일정', showWhen: 'always' },
  { href: '/plan', label: '일정 보기', showWhen: 'hasItinerary' },
  { href: '/plan/share', label: '공유', showWhen: 'hasItinerary' },
]

export function Navigation() {
  const pathname = usePathname()
  const { itinerary, resetOnboarding } = useItineraryStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const visibleItems = navItems.filter((item) => {
    if (item.showWhen === 'always') return true
    if (item.showWhen === 'hasItinerary') return !!itinerary
    if (item.showWhen === 'noItinerary') return !itinerary
    return true
  })
  
  const handleShowOnboarding = () => {
    resetOnboarding()
    setIsMenuOpen(false)
  }
  
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }
  
  return (
    <nav className="border-b border-gray-300 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link 
            href="/" 
            className="text-base md:text-lg font-bold hover:text-gray-600 transition-colors py-2 px-2 -ml-2"
            onClick={handleLinkClick}
          >
            일본 여행 일정
          </Link>
          
          {/* 햄버거 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-1.5 p-2 touch-manipulation"
            aria-label="메뉴"
          >
            <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
        
        {/* 메뉴 드로어 */}
        <>
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div 
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">메뉴</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 transition-colors touch-manipulation"
                    aria-label="메뉴 닫기"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname?.startsWith(item.href))
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`block py-3 px-4 text-base font-medium transition-colors touch-manipulation rounded ${
                          isActive
                            ? 'text-black bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                  <button
                    onClick={handleShowOnboarding}
                    className="block w-full text-left py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation rounded"
                  >
                    온보딩 다시보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </nav>
  )
}

