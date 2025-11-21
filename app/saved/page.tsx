'use client'

import { useRouter } from 'next/navigation'
import { useItineraryStore } from '@/store/itineraryStore'
import { useState } from 'react'
import { EditItineraryModal } from '@/components/EditItineraryModal'
import { generateItinerary } from '@/lib/itineraryGenerator'
import type { TripPreferences } from '@/types'

export default function SavedItinerariesPage() {
  const router = useRouter()
  const { savedItineraries, loadSavedItinerary, deleteSavedItinerary, updateSavedItineraryTitle, updateSavedItinerary } = useItineraryStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState<string>('')
  const [editingConditionsId, setEditingConditionsId] = useState<string | null>(null)

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

  const handleStartEdit = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setEditTitle(currentTitle || '')
  }

  const handleSaveEdit = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (editTitle.trim()) {
      updateSavedItineraryTitle(id, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleCancelEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingId(null)
    setEditTitle('')
  }

  const handleEditConditions = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingConditionsId(id)
  }

  const handleSaveConditions = (preferences: TripPreferences) => {
    if (!editingConditionsId) return
    
    const saved = savedItineraries.find((si) => si.id === editingConditionsId)
    if (!saved) return
    
    // 모달 닫기 (즉시 UI 반응)
    setEditingConditionsId(null)
    
    // 무거운 작업을 비동기로 처리하여 메인 스레드 블로킹 방지
    setTimeout(() => {
      // 새로운 일정 생성
      const newItinerary = generateItinerary(preferences)
      
      // 저장된 일정 업데이트
      updateSavedItinerary(editingConditionsId, newItinerary, saved.title)
      
      // 완료 알림
      setTimeout(() => {
        alert('일정 조건이 수정되었습니다.')
      }, 0)
    }, 0)
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
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {editingId === saved.id ? (
                          <div className="mb-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveEdit(saved.id)
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit()
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full border border-black px-3 py-2 text-base md:text-lg font-semibold focus:outline-none rounded-[8px]"
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={(e) => handleSaveEdit(saved.id, e)}
                                className="px-3 py-1 text-xs md:text-sm border border-black hover:bg-black hover:text-white transition-colors rounded-[8px]"
                              >
                                저장
                              </button>
                              <button
                                onClick={(e) => handleCancelEdit(e)}
                                className="px-3 py-1 text-xs md:text-sm border border-gray-400 hover:bg-gray-100 transition-colors rounded-[8px]"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-base md:text-lg font-semibold mb-1 cursor-pointer hover:text-gray-600"
                              onClick={() => handleLoad(saved.id)}
                            >
                              {saved.title || saved.itinerary.city}
                            </h3>
                            <button
                              onClick={(e) => handleStartEdit(saved.id, saved.title || saved.itinerary.city, e)}
                              className="text-xs md:text-sm text-gray-500 hover:text-black px-2 py-1 border border-gray-300 hover:border-black transition-colors rounded-[8px]"
                              title="제목 편집"
                            >
                              편집
                            </button>
                          </div>
                        )}
                        <p
                          className="text-sm md:text-base text-gray-600 cursor-pointer"
                          onClick={() => handleLoad(saved.id)}
                        >
                          {saved.itinerary.startDate} ~ {saved.itinerary.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 rounded-[8px]">
                        {saved.itinerary.city}
                      </span>
                      <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 rounded-[8px]">
                        성인 {saved.itinerary.preferences.adults}명
                        {saved.itinerary.preferences.children > 0 && ` · 아이 ${saved.itinerary.preferences.children}명`}
                      </span>
                      <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 rounded-[8px]">
                        {saved.itinerary.preferences.budget === 'low' ? '저예산' : saved.itinerary.preferences.budget === 'medium' ? '보통' : '고예산'}
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
                      onClick={(e) => handleEditConditions(saved.id, e)}
                      className="px-4 py-2 text-sm md:text-base border border-gray-400 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation rounded-[8px] whitespace-nowrap"
                    >
                      조건 수정
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

      {/* 조건 수정 모달 */}
      {editingConditionsId && (() => {
        const saved = savedItineraries.find((si) => si.id === editingConditionsId)
        if (!saved) return null
        
        return (
          <EditItineraryModal
            isOpen={!!editingConditionsId}
            onClose={() => setEditingConditionsId(null)}
            initialPreferences={saved.itinerary.preferences}
            onSave={handleSaveConditions}
          />
        )
      })()}
    </main>
  )
}

