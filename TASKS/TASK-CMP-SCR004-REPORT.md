# TASK-CMP-SCR004-REPORT — 신고 모달

- **Category:** Component
- **Implementation Status:** IMPLEMENT(간소화)
- **Requirement Ref:** REQ-FUNC-039
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-DETAIL, API-REPORTS
- **Expected Files:** `src/components/screens/scr004/ReportModal.tsx`
- **Functional AC:** 사유코드 Select + 설명 textarea로 `API-REPORTS`에 제출하고, 접수번호를 3초 이내 표시한다(REQ-FUNC-039).
- **Visual AC:** Modal(`{elevation.drawer-modal}` + scrim), 44px 닫기 버튼.
- **Security/Privacy AC:** 해당 없음(신고자 정보는 서버 세션에서 자동 채움).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P2
