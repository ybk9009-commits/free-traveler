# TASK-CMP-SCR001-HERO-SEARCH — Hero 통합 검색

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-003, REQ-FUNC-067
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DATA-DESTINATIONS, DATA-SAFETY
- **Expected Files:** `src/components/screens/scr001/HeroSearch.tsx`
- **Functional AC:**
  - `design-reference/D-001/DESIGN.md` § Search·Filter의 Hero pill 검색바(완전 원형, `{rounded.full}`)를 사용한다.
  - 여행지명·국가명·테마 키워드로 한글 부분 일치 검색을 수행하고, 여행지·안전정보를 통합 검색한다(REQ-FUNC-003, 067). 결과 유형 라벨과 하이라이트를 표시한다.
  - 보조 CTA "항공·숙소 준비하기"는 `/travel-tools`로 이동한다.
- **Visual AC:** Hero는 Desktop 뷰포트 60-70%(약 520-600px)로 제한해 다음 Section이 첫 화면에서 보이게 한다(D-001 § Hero 규칙). Mobile은 세로 스택.
- **Security/Privacy AC:** 해당 없음(공개 정적 검색).
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P1
