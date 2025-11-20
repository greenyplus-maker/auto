'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()
  
  return (
    <nav className="mb-3 md:mb-4">
      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 flex-wrap">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-400">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-black active:text-gray-800 transition-colors py-1 touch-manipulation"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-black py-1">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

