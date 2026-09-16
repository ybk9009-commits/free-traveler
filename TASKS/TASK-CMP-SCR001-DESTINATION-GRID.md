# TASK-CMP-SCR001-DESTINATION-GRID — 국내·해외 여행지 Card Grid + 테마 필터

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-068, REQ-NF-006
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DATA-DESTINATIONS, CMP-COMMON-FAVORITES-SHARE, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr001/DestinationGrid.tsx`, `src/components/common/DestinationCard.tsx`
- **Functional AC:**
  - 국내 6개, 해외 6개(국기 배지 포함) `card.destination`을 표시한다(콘텐츠 계약).
  - 국가·도시·계절·테마·기간 필터를 AND 조건으로 클라이언트에서 적용한다(REQ-FUNC-002).
  - 테마 Chip(6개) 선택 시 목록이 필터링된다(REQ-FUNC-002). 필터 상태는 `useSearchParams` 기반으로 URL에 반영되며 새로고침·공유 시 복원된다(REQ-FUNC-010, 허용 키만 직렬화).
  - 필터 결과 0건이면 `CMP-COMMON-EMPTY-STATE`(조건 완화 안내 + 전체 초기화 버튼)로 대체한다(REQ-FUNC-005).
  - 즐겨찾기 아이콘 버튼은 `CMP-COMMON-FAVORITES-SHARE` 훅을 사용해 localStorage에 중복 없이 토글한다(REQ-FUNC-068).
- **Visual AC:** 카드 이미지 4:3, `{rounded.lg}` 클리핑, `Next/Image` 반응형+lazy(REQ-NF-006). Desktop 3열 → Tablet 2열 → Mobile 1열. 카드 정지 상태 그림자 없음, hover 시 `{elevation.card-hover}`.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- **Priority:** P1
