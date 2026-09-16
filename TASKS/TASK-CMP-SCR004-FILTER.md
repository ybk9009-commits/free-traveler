# TASK-CMP-SCR004-FILTER — 검색 Filter + 결과 요약

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-030
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** API-BLOCKS, DB-ACCESS
- **Expected Files:** `src/components/screens/scr004/Filter.tsx`
- **Functional AC:**
  - 국가·지역·기간 겹침·모집상태 Filter를 제공하고 "N건의 동행글" 결과 요약을 표시한다(REQ-FUNC-030).
  - 차단한/차단당한 사용자의 글은 결과에서 제외한다(`API-BLOCKS`의 조인 필터 사용).
- **Visual AC:** 좌우 분할(Filter+요약).
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1
