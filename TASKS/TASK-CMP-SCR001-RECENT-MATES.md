# TASK-CMP-SCR001-RECENT-MATES — 최근 동행 카드 3개/Empty State

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** —(디자인 계약: D-001 §화면별 Section 순서, SCR-004 데이터 재사용)
- **Screen:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`(PAGE-SCR001이 조립)
- **Depends On:** DB-ACCESS, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr001/RecentMates.tsx`
- **Functional AC:**
  - `mate_posts`에서 `status=OPEN`인 최신 3건을 `card.mate`로 표시한다. "전체 동행 보기" CTA는 `/mates`로 이동한다.
  - 0건이면 `CMP-COMMON-EMPTY-STATE`(상황 설명 + 참가 방법 3줄 요약 + "동행 글 작성하기" CTA → `/travel-tools` 동행 탭)로 대체한다.
- **Visual AC:** Card Grid 3열(Mobile 1열), 모집상태 배지(모집중/마감).
- **Security/Privacy AC:** 작성자 연락처를 노출하지 않는다(REQ-FUNC-033과 동일 원칙 재사용).
- **Verify:** E2E-PUBLIC-SMOKE
- **Priority:** P2
