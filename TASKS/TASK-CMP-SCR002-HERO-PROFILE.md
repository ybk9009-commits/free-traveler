# TASK-CMP-SCR002-HERO-PROFILE — 대표 소개 Hero

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-057
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr002/HeroProfile.tsx`
- **Functional AC:** 대표 사진(alt: 실제 인물 촬영 설명) + 소개 한 문장 + `CMP-SCR001-ABOUT-SUMMARY`와 동일한 `displayName`/지표 라벨을 표시한다.
- **Visual AC:** 좌우 분할 Hero, Desktop 60-70% 높이 제한.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2
