# TASK-CMP-SCR001-DESTINATION-DETAIL-DRAWER — 여행지 상세 Drawer

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-007(축소), REQ-FUNC-009, REQ-FUNC-069
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** CMP-SCR001-DESTINATION-GRID, DATA-DESTINATIONS, DATA-SAFETY, CMP-COMMON-FAVORITES-SHARE
- **Expected Files:** `src/components/screens/scr001/DestinationDetailDrawer.tsx`
- **Functional AC:**
  - 대표 이미지, 300자+ 소개, 명소·체험 5개+, 추천/비추천 시기, 1일·3일 일정, 예상 예산, 교통, 음식 3개+, 문화·에티켓 3개+, 출처·최종 수정일을 표시한다(REQ-FUNC-004).
  - 해외 여행지는 "이 나라 안전정보 보기" 버튼으로 `CMP-SCR001-SAFETY-SECTION`의 안전정보 Drawer로 전환한다(REQ-FUNC-006, `country_code` 일치).
  - 관련 여행지 최대 6개(같은 국가·테마, 비공개·현재 여행지 제외)를 하단에 표시한다(REQ-FUNC-009).
  - URL 공유 버튼 제공, Web Share API 실패 시 클립보드 복사로 폴백(REQ-FUNC-069).
- **Visual AC:** Desktop 우측 슬라이드 Drawer(480-560px, `{elevation.drawer-modal}`), Mobile 하단 풀스크린 시트. 상단 고정 헤더 + 44px 닫기 버튼.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P1
