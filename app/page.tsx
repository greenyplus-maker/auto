'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  // 도메인 접속 시 항상 그리팅 페이지로 리다이렉트
  useEffect(() => {
    router.replace('/greeting')
  }, [router])
  
  return null
}

