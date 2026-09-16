# TASK-CMP-SCR004-APPLY — 참가 메시지 신청 폼

- **Category:** Component
- **Implementation Status:** IMPLEMENT
- **Requirement Ref:** REQ-FUNC-034, REQ-FUNC-035
- **Screen:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`(PAGE-SCR004가 조립)
- **Depends On:** CMP-SCR004-DETAIL, API-MATE-APPLICATIONS, INFRA-ADULT-VERIFICATION
- **Expected Files:** `src/components/screens/scr004/ApplyForm.tsx`
- **Functional AC:**
  - 500자 이내 참가 메시지를 `API-MATE-APPLICATIONS`로 제출한다(REQ-FUNC-034).
  - 중복 신청 시 서버 오류를 인라인으로 표시한다(REQ-FUNC-035).
  - 미로그인/미성년 사용자가 신청을 시도하면 `/account`로 유도하는 안내를 표시한다.
- **Visual AC:** 상세 패널 내 인라인 폼.
- **Security/Privacy AC:** 신청 메시지는 신청자 본인과 글 작성자만 조회 가능(RLS).
- **Verify:** E2E-MATE-AUTH
- **Priority:** P1
