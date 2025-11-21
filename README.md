# 일본 여행 일정 자동 생성기

Next.js, TypeScript, Tailwind CSS로 구현된 모노크롬 웹 애플리케이션입니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3001](http://localhost:3001)을 열어 확인하세요.

## Google Maps API 설정 (선택사항)

스팟 상세 페이지에 지도를 표시하려면 Google Maps API 키가 필요합니다.

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Maps JavaScript API 활성화
3. API 키 생성
4. 프로젝트 루트에 `.env.local` 파일 생성:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

API 키가 없어도 앱은 정상 작동하며, 지도만 표시되지 않습니다.

## 기능

- 여행 조건 입력 (도시, 날짜, 여행자 수, 여행 스타일 등)
- 자동 일정 생성
- 일별 상세 일정 보기 및 편집
- 장소 상세 정보
- 일정 공유/내보내기

