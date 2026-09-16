# TASK-CMP-SCR004-DETAIL — 동행 상세 패널

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-033
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-LIST
- **Expected Files:** `src/components/screens/scr004/MateDetailPanel.tsx`
- **Functional AC:**
  - 작성자 정보(연락처 비공개), 국가·지역·기간·인원, 선호조건·여행스타일, 설명, 모집상태 배지를 표시한다(REQ-FUNC-033).
  - 작성자 본인이 열람 시 "내 글 관리는 계정 > 내 활동에서" 안내 배너를 표시한다.
- **Visual AC:** Desktop 좌(목록)/우(상세) 분할, Mobile 목록→상세 하단 Drawer 전환(좌우 분할 유지 금지).
- **Security/Privacy AC:** 응답 JSON/HTML에 이메일·전화번호가 포함되지 않는다(REQ-FUNC-033 핵심 AC).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1
