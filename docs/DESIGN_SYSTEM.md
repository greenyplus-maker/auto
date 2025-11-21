# 디자인 시스템 가이드

## 개요

이 프로젝트는 모노크롬(흑백) 디자인을 기반으로 한 텍스트 중심의 UI를 사용합니다.

## 디자인 원칙

1. **모노크롬**: 흑백과 그레이스케일만 사용
2. **텍스트 중심**: 이미지, 아이콘, 이모지 없음
3. **모바일 우선**: 모바일 환경을 최우선으로 고려
4. **명확한 계층**: 타이포그래피와 간격으로 정보 계층 구조화

## 디자인 토큰

### 색상

```typescript
// Primary
black (주요 액션, 텍스트)
gray-800 (호버 상태)
gray-900 (액티브 상태)

// Background
white (기본 배경)
gray-50 (보조 배경)
gray-100 (터치 영역)

// Text
black (주요 텍스트)
gray-700 (보조 텍스트)
gray-600 (3차 텍스트)
gray-500 (비활성 텍스트)
gray-400 (구분선)

// Border
gray-300 (기본 보더)
gray-400 (호버 보더)
black (액티브/선택 보더)
```

### 타이포그래피

#### 제목
- **H1**: `text-2xl md:text-3xl lg:text-4xl font-bold leading-tight`
- **H2**: `text-xl md:text-2xl lg:text-3xl font-bold leading-tight`
- **H3**: `text-lg md:text-xl font-semibold`
- **H4**: `text-base md:text-lg font-semibold`

#### 본문
- **Large**: `text-base md:text-lg`
- **Medium**: `text-sm md:text-base`
- **Small**: `text-xs md:text-sm`

### 간격

#### 컨테이너
- **패딩**: `p-4 md:p-8` (모바일 16px, 데스크톱 32px)
- **세로 마진**: `mb-6 md:mb-8` (모바일 24px, 데스크톱 32px)

#### 요소 간격
- **기본 간격**: `gap-3 md:gap-4` (모바일 12px, 데스크톱 16px)
- **섹션 간격**: `space-y-4 md:space-y-6`

### 버튼 스타일

#### Primary Button
```tsx
className="w-full border-2 border-black px-6 py-4 md:px-8 md:py-3 text-base md:text-lg font-medium hover:bg-black hover:text-white active:bg-gray-800 transition-colors touch-manipulation"
```

#### Secondary Button
```tsx
className="border border-gray-400 px-4 py-3 md:py-2 text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
```

#### Text Button
```tsx
className="text-sm md:text-base text-gray-600 hover:text-black transition-colors touch-manipulation"
```

### 카드 스타일

#### 기본 카드
```tsx
className="border border-gray-300 p-4 md:p-5"
```

#### 인터랙티브 카드
```tsx
className="border-2 border-gray-300 p-4 md:p-5 hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation"
```

#### 선택된 카드
```tsx
className="border-2 border-black bg-black text-white"
```

### 입력 필드

```tsx
className="w-full border border-gray-400 px-4 py-3 md:py-2 bg-white text-base md:text-sm touch-manipulation"
```

## 사용 방법

### 디자인 토큰 import

```typescript
import { designTokens, buttonVariants, typography } from '@/styles'
```

### 버튼 스타일 사용

```tsx
import { getButtonClasses } from '@/styles'

<button className={getButtonClasses('primary', 'large')}>
  버튼
</button>
```

### 타이포그래피 사용

```tsx
import { typography } from '@/styles'

<h1 className={typography.h1}>제목</h1>
<p className={typography.bodyMedium}>본문</p>
```

## 반응형 디자인

모든 스타일은 모바일 우선으로 작성됩니다:
- 기본값: 모바일 스타일
- `md:` 접두사: 768px 이상에서 적용
- `lg:` 접두사: 1024px 이상에서 적용

## 터치 최적화

모든 인터랙티브 요소에는 `touch-manipulation` 클래스를 추가하여 터치 반응성을 향상시킵니다.

## 접근성

- 최소 터치 영역: 44x44px
- 명확한 포커스 상태
- 충분한 색상 대비 (흑백)

