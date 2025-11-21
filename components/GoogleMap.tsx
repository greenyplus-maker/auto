'use client'

import { useMemo } from 'react'
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

const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503, // 도쿄 기본 위치
}

export function GoogleMapComponent({ 
  latitude, 
  longitude, 
  placeName,
  height = '400px'
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  const center = useMemo(() => ({
    lat: latitude,
    lng: longitude,
  }), [latitude, longitude])

  const mapStyle = useMemo(() => ({
    ...mapContainerStyle,
    height,
  }), [height])

  if (!apiKey || apiKey === 'your_api_key_here') {
    return (
      <div 
        className="w-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600"
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
    <LoadScript googleMapsApiKey={apiKey}>
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
      >
        <Marker
          position={center}
          title={placeName}
        />
      </GoogleMap>
    </LoadScript>
  )
}

