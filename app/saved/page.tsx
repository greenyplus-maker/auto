'use client'

import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { useState } from 'react'

export default function SavedItinerariesPage() {
  const router = useRouter()
  const { savedItineraries, loadSavedItinerary, deleteSavedItinerary } = useItineraryStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleLoad = (id: string) => {
    const itinerary = loadSavedItinerary(id)
    if (itinerary) {
      router.push('/plan')
    }
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('저장된 일정을 삭제하시겠습니까?')) {
      setDeletingId(id)
      deleteSavedItinerary(id)
      setTimeout(() => setDeletingId(null), 300)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gray-300 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">저장된 일정</h1>
          <p className="text-sm md:text-base text-gray-600">
            {savedItineraries.length}개의 일정이 저장되어 있습니다
          </p>
        </div>

        {savedItineraries.length === 0 ? (
          <div className="border border-gray-300 rounded-[16px] p-8 md:p-12 text-center">
            <p className="text-base md:text-lg text-gray-600 mb-4">저장된 일정이 없습니다</p>
            <button
              onClick={() => router.push('/plan/new')}
              className="border border-black px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation rounded-[8px]"
            >
              새 일정 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {savedItineraries.map((saved) => (
              <div
                key={saved.id}
                className={`border border-gray-300 rounded-[16px] p-4 md:p-6 hover:bg-gray-50 active:bg-gray-100 transition-all ${
                  deletingId === saved.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleLoad(saved.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold mb-1">
                          {saved.itinerary.city}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">
                          {saved.itinerary.startDate} ~ {saved.itinerary.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 rounded-[8px]">
                        {saved.itinerary.days.length}일
                      </span>
                      <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 rounded-[8px]">
                        성인 {saved.itinerary.preferences.adults}명
                        {saved.itinerary.preferences.children > 0 && ` · 아이 ${saved.itinerary.preferences.children}명`}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">
                      저장일: {formatDate(saved.savedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleLoad(saved.id)}
                      className="px-4 py-2 text-sm md:text-base border border-black hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation rounded-[8px] whitespace-nowrap"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={(e) => handleDelete(saved.id, e)}
                      className="px-4 py-2 text-sm md:text-base border border-gray-400 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation rounded-[8px] whitespace-nowrap"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

