# TASK-CMP-SCR004-BLOCK — 차단 버튼·확인

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-040
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-DETAIL, API-BLOCKS
- **Expected Files:** `src/components/screens/scr004/BlockButton.tsx`
- **Functional AC:** 상세 패널에서 작성자 차단 액션을 제공하고 `API-BLOCKS` 호출 후 `CMP-COMMON-TOAST`로 결과를 알린다(REQ-FUNC-040).
- **Visual AC:** `button.secondary` 스타일, 확인 다이얼로그 포함.
- **Security/Privacy AC:** 해당 없음.
- **Verify:** E2E-MATE-AUTH
- **Priority:** P2
