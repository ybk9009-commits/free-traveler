# TASK-CMP-SCR002-STATS-STORY — 여행 지표 + 소개·철학

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-058
- **Screen:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`(PAGE-SCR002가 조립)
- **Depends On:** DATA-REPRESENTATIVE
- **Expected Files:** `src/components/screens/scr002/StatsStory.tsx`
- **Functional AC:** 지표 카드 3개("50+ Trips"/"30+ Countries"/대륙 수) + 소개/여행 철학/편집 원칙 문단 2개 이상을 표시한다(REQ-FUNC-058).
- **Visual AC:** 지표 카드 Grid(3열) + 텍스트 중심 좌우 분할.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2
