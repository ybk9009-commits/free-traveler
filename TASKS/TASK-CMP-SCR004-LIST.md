# TASK-CMP-SCR004-LIST — 동행 목록 Card Grid

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037(축소), REQ-FUNC-069
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-FILTER, DB-ACCESS, CMP-COMMON-FAVORITES-SHARE, CMP-COMMON-EMPTY-STATE
- **Expected Files:** `src/components/screens/scr004/MateList.tsx`
- **Functional AC:**
  - 최근 등록순 최대 8개를 `card.mate`로 우선 노출하고 "더 보기"로 이어서 확인한다(콘텐츠 계약).
  - 종료일 경과 글은 조회 시점에 CLOSED로 계산해 배지에 반영한다(REQ-FUNC-037 축소).
  - 작성자 정보는 표시하되 연락처는 노출하지 않는다(REQ-FUNC-033).
  - URL 공유 버튼(Web Share API, 실패 시 클립보드 복사) 제공(REQ-FUNC-069).
  - 검색 결과 0건/전체 글 0건이면 `CMP-COMMON-EMPTY-STATE`("조건에 맞는 동행글이 아직 없어요" + 필터 초기화 + "첫 동행 글 작성하기" CTA)로 대체한다.
- **Visual AC:** Card Grid, 모집상태 배지(모집중/마감).
- **Security/Privacy AC:** 목록 API 응답에 이메일·전화번호를 포함하지 않는다.
- **Verify:** E2E-MATE-AUTH, TEST-A11Y-AXE
- **Priority:** P1
