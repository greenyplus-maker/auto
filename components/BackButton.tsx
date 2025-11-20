'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  href?: string
  label?: string
}

export function BackButton({ href, label = '뒤로' }: BackButtonProps) {
  const router = useRouter()
  
  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }
  
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm md:text-base text-gray-600 hover:text-black active:text-gray-800 transition-colors mb-4 py-2 px-2 -ml-2 touch-manipulation"
    >
      <span className="text-lg">←</span>
      <span>{label}</span>
    </button>
  )
}

