'use client'

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
  const { itinerary } = useItineraryStore()
  
  const visibleItems = navItems.filter((item) => {
    if (item.showWhen === 'always') return true
    if (item.showWhen === 'hasItinerary') return !!itinerary
    if (item.showWhen === 'noItinerary') return !itinerary
    return true
  })
  
  return (
    <nav className="border-b border-gray-300 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link 
            href="/" 
            className="text-base md:text-lg font-bold hover:text-gray-600 transition-colors py-2 px-2 -ml-2"
          >
            일본 여행 일정
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6 overflow-x-auto">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname?.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm md:text-base font-medium transition-colors py-2 px-3 md:px-4 whitespace-nowrap ${
                    isActive
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

