# TASK-CMP-SCR001-ABOUT-SUMMARY — 대표 소개 요약 카드

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-057
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr001/AboutSummary.tsx`
- **Functional AC:**
  - `DATA-REPRESENTATIVE`의 `displayName`/`tripCountLabel`/`countryCountLabel`을 그대로 표시하며 `/about`(`CMP-SCR002-HERO-PROFILE`)과 값이 100% 일치해야 한다(REQ-FUNC-057, 단일 데이터 소스 사용으로 보증).
  - "대표 소개 더 보기" CTA는 `/about`로 이동한다.
- **Visual AC:** 좌우 분할(이미지+텍스트) 레이아웃.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE(값 일치 assertion), TEST-DATA-VALIDATION
- **Priority:** P2

### 6.2 SCR-002
