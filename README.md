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

### 로컬 개발 환경

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Maps JavaScript API 활성화
3. API 키 생성
4. 프로젝트 루트에 `.env.local` 파일 생성:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
5. API 키 설정 → 애플리케이션 제한사항 → HTTP 리퍼러(웹사이트) 선택
6. 다음 URL 추가:
   - `http://localhost:3001/*`
   - `http://localhost:3000/*`

### Vercel 배포 환경

1. Vercel 대시보드 → 프로젝트 선택 → Settings → Environment Variables
2. 다음 환경 변수 추가:
   - **Name**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: Google Maps API 키
   - **Environment**: Production, Preview, Development 모두 선택
3. Google Cloud Console에서 API 키 설정 → 애플리케이션 제한사항 → HTTP 리퍼러(웹사이트) 선택
4. 다음 URL 추가:
   - `https://your-vercel-domain.vercel.app/*`
   - `https://*.vercel.app/*` (모든 Vercel 프리뷰 URL 허용)
5. Vercel에서 프로젝트 재배포 (환경 변수 변경 후 자동 재배포되거나 수동으로 재배포)

API 키가 없어도 앱은 정상 작동하며, 지도만 표시되지 않습니다.

## 기능

- 여행 조건 입력 (도시, 날짜, 여행자 수, 여행 스타일 등)
- 자동 일정 생성
- 일별 상세 일정 보기 및 편집
- 장소 상세 정보
- 일정 공유/내보내기

