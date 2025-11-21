'use client'

import { useMemo, useState, useCallback } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

interface GoogleMapProps {
  latitude: number
  longitude: number
  placeName?: string
  height?: string
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
}

export function GoogleMapComponent({ 
  latitude, 
  longitude, 
  placeName,
  height = '400px'
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const center = useMemo(() => ({
    lat: latitude,
    lng: longitude,
  }), [latitude, longitude])

  const mapStyle = useMemo(() => ({
    ...mapContainerStyle,
    height,
  }), [height])

  const handleLoadError = useCallback((error: Error) => {
    console.error('Google Maps API 로드 오류:', error)
    const errorMessage = error.message || String(error)
    if (errorMessage.includes('RefererNotAllowedMapError')) {
      setMapError('API 키에 localhost가 허용되지 않았습니다. Google Cloud Console에서 HTTP 리퍼러에 http://localhost:3001/* 를 추가해주세요.')
    } else {
      setMapError('Google 지도가 제대로 로드되지 않았습니다. API 키 설정을 확인해주세요.')
    }
    setIsLoaded(false)
  }, [])

  const handleMapLoad = useCallback(() => {
    setMapError(null)
    setIsLoaded(true)
  }, [])

  if (!apiKey || apiKey === 'your_api_key_here') {
    return (
      <div 
        className="w-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 rounded-[8px]"
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="text-sm md:text-base mb-2">지도를 표시하려면 Google Maps API 키가 필요합니다.</p>
          <p className="text-xs md:text-sm text-gray-500">
            .env.local 파일에 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 설정해주세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ height }}>
      <LoadScript 
        googleMapsApiKey={apiKey}
        loadingElement={
          <div 
            className="w-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 rounded-[8px]"
            style={{ height }}
          >
            <div className="text-center p-4">
              <p className="text-sm md:text-base">지도를 불러오는 중...</p>
            </div>
          </div>
        }
        onLoad={() => setIsLoaded(true)}
        onError={handleLoadError}
      >
        {mapError ? (
          <div 
            className="w-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 rounded-[8px]"
            style={{ height }}
          >
            <div className="text-center p-4">
              <p className="text-sm md:text-base mb-2 font-semibold">{mapError}</p>
              <div className="text-xs md:text-sm text-gray-500 mt-3 space-y-1">
                <p>해결 방법:</p>
                <ol className="list-decimal list-inside text-left space-y-1 mt-2">
                  <li>Google Cloud Console → API 및 서비스 → 사용자 인증 정보</li>
                  <li>API 키 클릭 → 애플리케이션 제한사항</li>
                  <li>HTTP 리퍼러(웹사이트) 선택</li>
                  <li>다음 URL 추가: <code className="bg-gray-200 px-1 rounded">http://localhost:3001/*</code></li>
                  <li>저장 후 브라우저 완전 새로고침 (Cmd+Shift+R)</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={center}
            zoom={15}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
            onLoad={handleMapLoad}
          >
            <Marker
              position={center}
              title={placeName}
            />
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  )
}

